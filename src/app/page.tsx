'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: 'work', name: '仕事' },
  { id: 'family', name: '家庭' },
  { id: 'education', name: '教養' },
  { id: 'wealth', name: '財産' },
  { id: 'health', name: '健康' },
  { id: 'hobby', name: '趣味' }
];

export default function Home() {
  const [items, setItems] = useState<Record<string, string[]>>(() => {
    const initialItems: Record<string, string[]> = {};
    categories.forEach(category => {
      initialItems[category.id] = Array(20).fill('');
    });
    return initialItems;
  });

  const handleInputChange = (categoryId: string, index: number, value: string) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map((item, i) => i === index ? value : item)
    }));
  };

  const generatePDF = () => {
    // BOMを追加してUTF-8として認識されるようにする
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    
    const content = categories.map(category => {
      const items_text = items[category.id]
        .filter(item => item)
        .map((item, index) => `${index + 1}. ${item}`)
        .join('\n');

      return `【${category.name}】\n${items_text}`;
    }).join('\n\n');

    // BOMとコンテンツを結合
    const blob = new Blob([bom, content], { 
      type: 'text/plain;charset=utf-8' 
    });

    // ファイル名を設定してダウンロード
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'やりたいことリスト.txt';  // ファイル名を指定
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          やりたいことリスト100個
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {category.name}
              </h2>
              <div className="space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 text-right text-gray-400 text-sm">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      value={items[category.id][i]}
                      onChange={(e) => handleInputChange(category.id, i, e.target.value)}
                      placeholder={`${category.name}に関するやりたいこと ${i + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 
                     rounded-md transition-colors duration-200 font-medium"
          >
            PDFで出力
          </button>
        </div>

        <p className="mt-4 text-center text-gray-500">
          各カテゴリ20個ずつ、合計100個のやりたいことを入力できます
        </p>
      </div>
    </main>
  );
}