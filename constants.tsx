
import { ArabicLetter } from './types';

export interface ColoredArabicLetter extends ArabicLetter {
  color: string;
  darkColor: string;
}

export const ARABIC_ALPHABET: ColoredArabicLetter[] = [
  { char: 'أ', name: 'Alif', transliteration: 'a', exampleWord: 'أرنب', exampleTranslation: 'Rabbit', exampleImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-orange-100', darkColor: 'text-orange-600' },
  { char: 'ب', name: 'Ba', transliteration: 'b', exampleWord: 'بطة', exampleTranslation: 'Duck', exampleImage: 'https://images.unsplash.com/photo-1465153690352-10c1b29577f8?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-pink-100', darkColor: 'text-pink-600' },
  { char: 'ت', name: 'Ta', transliteration: 't', exampleWord: 'تفاح', exampleTranslation: 'Apple', exampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-red-100', darkColor: 'text-red-600' },
  { char: 'ث', name: 'Tha', transliteration: 'th', exampleWord: 'ثعلب', exampleTranslation: 'Fox', exampleImage: 'https://images.unsplash.com/photo-1644125003076-ce465d331769?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-amber-100', darkColor: 'text-amber-600' },
  { char: 'ج', name: 'Jeem', transliteration: 'j', exampleWord: 'جمل', exampleTranslation: 'Camel', exampleImage: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-emerald-100', darkColor: 'text-emerald-600' },
  { char: 'ح', name: 'Ha', transliteration: 'h', exampleWord: 'حصان', exampleTranslation: 'Horse', exampleImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-teal-100', darkColor: 'text-teal-600' },
  { char: 'خ', name: 'Kha', transliteration: 'kh', exampleWord: 'خبز', exampleTranslation: 'Bread', exampleImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-lime-100', darkColor: 'text-lime-600' },
  { char: 'د', name: 'Dal', transliteration: 'd', exampleWord: 'دب', exampleTranslation: 'Bear', exampleImage: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-blue-100', darkColor: 'text-blue-600' },
  { char: 'ذ', name: 'Thal', transliteration: 'dh', exampleWord: 'ذرة', exampleTranslation: 'Corn', exampleImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-indigo-100', darkColor: 'text-indigo-600' },
  { char: 'ر', name: 'Ra', transliteration: 'r', exampleWord: 'رمان', exampleTranslation: 'Pomegranate', exampleImage: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-violet-100', darkColor: 'text-violet-600' },
  { char: 'ز', name: 'Zay', transliteration: 'z', exampleWord: 'زرافة', exampleTranslation: 'Giraffe', exampleImage: 'https://images.unsplash.com/photo-1612358405970-e1aeba9d76c2?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-purple-100', darkColor: 'text-purple-600' },
  { char: 'س', name: 'Seen', transliteration: 's', exampleWord: 'سمكة', exampleTranslation: 'Fish', exampleImage: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-fuchsia-100', darkColor: 'text-fuchsia-600' },
  { char: 'ش', name: 'Sheen', transliteration: 'sh', exampleWord: 'شمس', exampleTranslation: 'Sun', exampleImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-rose-100', darkColor: 'text-rose-600' },
  { char: 'ص', name: 'Sad', transliteration: 's', exampleWord: 'صقر', exampleTranslation: 'Falcon', exampleImage: 'https://images.unsplash.com/photo-1611637576109-b6f76185ec9b?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-sky-100', darkColor: 'text-sky-600' },
  { char: 'ض', name: 'Dad', transliteration: 'd', exampleWord: 'ضفدع', exampleTranslation: 'Frog', exampleImage: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-cyan-100', darkColor: 'text-cyan-600' },
  { char: 'ط', name: 'Ta', transliteration: 't', exampleWord: 'طائرة', exampleTranslation: 'Plane', exampleImage: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-orange-100', darkColor: 'text-orange-600' },
  { char: 'ظ', name: 'Za', transliteration: 'z', exampleWord: 'ظرف', exampleTranslation: 'Envelope', exampleImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-yellow-100', darkColor: 'text-yellow-600' },
  { char: 'ع', name: 'Ain', transliteration: 'a', exampleWord: 'عصفور', exampleTranslation: 'Bird', exampleImage: 'https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-blue-100', darkColor: 'text-blue-600' },
  { char: 'غ', name: 'Ghain', transliteration: 'gh', exampleWord: 'غزالة', exampleTranslation: 'Gazelle', exampleImage: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-green-100', darkColor: 'text-green-600' },
  { char: 'ف', name: 'Fa', transliteration: 'f', exampleWord: 'فيل', exampleTranslation: 'Elephant', exampleImage: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-slate-100', darkColor: 'text-slate-600' },
  { char: 'ق', name: 'Qaf', transliteration: 'q', exampleWord: 'قرد', exampleTranslation: 'Monkey', exampleImage: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-purple-100', darkColor: 'text-purple-600' },
  { char: 'ك', name: 'Kaf', transliteration: 'k', exampleWord: 'كتاب', exampleTranslation: 'Book', exampleImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-amber-100', darkColor: 'text-amber-600' },
  { char: 'ل', name: 'Lam', transliteration: 'l', exampleWord: 'ليمون', exampleTranslation: 'Lemon', exampleImage: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-yellow-100', darkColor: 'text-yellow-600' },
  { char: 'م', name: 'Meem', transliteration: 'm', exampleWord: 'موز', exampleTranslation: 'Banana', exampleImage: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-orange-100', darkColor: 'text-orange-600' },
  { char: 'ن', name: 'Noon', transliteration: 'n', exampleWord: 'نحلة', exampleTranslation: 'Bee', exampleImage: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-yellow-100', darkColor: 'text-yellow-600' },
  { char: 'هـ', name: 'Ha', transliteration: 'h', exampleWord: 'هلال', exampleTranslation: 'Crescent', exampleImage: 'https://images.unsplash.com/photo-1565619866477-23f88e6a5f58?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-blue-100', darkColor: 'text-blue-600' },
  { char: 'و', name: 'Waw', transliteration: 'w', exampleWord: 'ولد', exampleTranslation: 'Boy', exampleImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-pink-100', darkColor: 'text-pink-600' },
  { char: 'ي', name: 'Ya', transliteration: 'y', exampleWord: 'يد', exampleTranslation: 'Hand', exampleImage: 'https://images.unsplash.com/photo-1556848527-f7c548b972b2?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-cyan-100', darkColor: 'text-cyan-600' },
];

export const TEAM_COLORS = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-emerald-500',
];

// Visual Similarity Groups for Glyph Galaxy
export const SIMILARITY_GROUPS = [
  ['ب', 'ت', 'ث'],
  ['ج', 'ح', 'خ'],
  ['د', 'ذ'],
  ['ر', 'ز'],
  ['س', 'ش'],
  ['ص', 'ض'],
  ['ط', 'ظ'],
  ['ع', 'غ'],
  ['ف', 'ق'],
];
