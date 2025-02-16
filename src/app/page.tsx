'use client';
import React, { useState } from 'react';
import jsPDF from 'jspdf';

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

 const generatePDF = async () => {
    try {
      // PDFドキュメントを作成
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // フォントサイズと行間を設定
      const margin = 20;
      let y = margin;

      // タイトルを追加（日本語なしで）
      doc.setFontSize(18);
      doc.text('List of 100 Things', doc.internal.pageSize.width / 2, y, { align: 'center' });
      y += 15;

      // カテゴリごとの内容を追加
      doc.setFontSize(12);
      categories.forEach(category => {
        // ページをまたぐ場合は新しいページを追加
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = margin;
        }

        // カテゴリ名を追加
        doc.text(`[${category.name}]`, margin, y);
        y += 8;

        // アイテムを追加
        const categoryItems = items[category.id].filter(item => item.trim());
        
        if (categoryItems.length === 0) {
          if (y > doc.internal.pageSize.height - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text('None', margin + 5, y);
          y += 8;
        } else {
          categoryItems.forEach((item, index) => {
            if (y > doc.internal.pageSize.height - margin) {
              doc.addPage();
              y = margin;
            }
            doc.text(`${index + 1}. ${item}`, margin + 5, y);
            y += 8;
          });
        }

        y += 5; // カテゴリ間の余白
      });

      // PDFを保存
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      doc.save(`bucket-list_${timestamp}.pdf`);

    } catch (error) {
      console.error('PDFの出力に失敗しました:', error);
      alert('PDFの出力に失敗しました。もう一度お試しください。');
    }
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