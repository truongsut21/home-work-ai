import { logger } from '@/lib/logger';

const PVOIL_URL = 'https://www.pvoil.com.vn/tin-gia-xang-dau';

export interface FuelPrice {
  index: number;
  name: string;
  price: string;
  change: string;
}

export interface FuelPriceResult {
  prices: FuelPrice[];
  updatedAt: string;
  source: string;
}

/**
 * Crawl bảng giá xăng dầu mới nhất từ PVOIL.
 * Parse HTML table trực tiếp — không cần headless browser.
 */
export async function getFuelPrices(): Promise<FuelPriceResult> {
  const log = logger.child({ service: 'fuel-price' });

  try {

    // giả lập đợi 5s ở đây
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(PVOIL_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 300 }, // cache 5 phút
    });

    if (!response.ok) {
      throw new Error(`PVOIL responded with status ${response.status}`);
    }

    const html = await response.text();

    // Parse ngày cập nhật từ thead
    const dateMatch = html.match(
      /Giá điều chỉnh lúc\s*([\d:]+)\s*ngày\s*([\d/]+)/,
    );
    const updatedAt = dateMatch
      ? `${dateMatch[1]} ngày ${dateMatch[2]}`
      : 'Không xác định';

    // Parse từng row trong tbody
    const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
    if (!tbodyMatch) {
      throw new Error('Không tìm thấy bảng giá trong HTML PVOIL');
    }

    const tbody = tbodyMatch[1];
    const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
    const prices: FuelPrice[] = [];

    let rowMatch;
    while ((rowMatch = rowRegex.exec(tbody)) !== null) {
      const row = rowMatch[1];

      // Lấy tất cả <td> content
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
      const cells: string[] = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(row)) !== null) {
        // Strip HTML tags và trim
        const text = tdMatch[1].replace(/<[^>]*>/g, '').trim();
        cells.push(text);
      }

      // cells[0] = TT, cells[1] = Tên, cells[2] = Giá, cells[3] = Chênh lệch
      if (cells.length >= 4) {
        const index = parseInt(cells[0], 10);
        if (!isNaN(index)) {
          prices.push({
            index,
            name: cells[1],
            price: cells[2],
            change: cells[3],
          });
        }
      }
    }

    if (prices.length === 0) {
      throw new Error('Parse được 0 mặt hàng từ bảng giá PVOIL');
    }

    log.info(`Crawled ${prices.length} fuel prices from PVOIL`, { updatedAt });

    return {
      prices,
      updatedAt,
      source: PVOIL_URL,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    log.error('Failed to crawl PVOIL fuel prices', { error: message });
    throw new Error(`Không thể lấy giá xăng từ PVOIL: ${message}`);
  }
}
