'use client';
import React, { useState } from 'react';

const categories = [
  { id: 'work', name: '仕事' },
  { id: 'family', name: '家庭' },
  { id: 'education', name: '教養' },
  { id: 'wealth', name: '財産' },
  { id: 'health', name: '健康' },
  { id: 'hobby', name: '趣味' }
];

export default function Home() {
  const [items, setItems] = useState(() => {
    const initialItems = {};
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
    const content = categories.map(category => {
      return `
=== ${category.name} ===
${items[category.id].filter(item => item).map((item, index) => `${index + 1}. ${item}`).join('\n')}
      `;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">やりたいことリスト100個</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => (
          <div key={category.id} className="mb-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">{category.name}</h2>
            <div className="space-y-2">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8 text-right text-gray-500">{i + 1}.</span>
                  <input
                    type="text"
                    value={items[category.id][i]}
                    onChange={(e) => handleInputChange(category.id, i, e.target.value)}
                    placeholder={`${category.name}に関するやりたいこと ${i + 1}`}
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          PDFで出力
        </button>
      </div>

      <div className="mt-4 text-center text-gray-500">
        <p>各カテゴリ20個ずつ、合計100個のやりたいことを入力できます</p>
      </div>
    </div>
  );
}