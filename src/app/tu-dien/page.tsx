import type { Metadata } from 'next';
import DictionaryPageWrapper from '@/features/dictionary/components/dictionary-page-wrapper';

export const metadata: Metadata = {
  title: 'Từ điển Cô Lành - Học từ vựng tiếng Anh theo phong cách hài hước',
  description:
    'Tra cứu từ vựng tiếng Anh với Cô Lành — giải thích hài hước nhưng chuẩn ngữ pháp. Có phiên âm, ví dụ và cấp độ khó.',
};

export default function DictionaryPage() {
  return <DictionaryPageWrapper />;
}
