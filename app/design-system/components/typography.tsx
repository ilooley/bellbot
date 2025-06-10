"use client";

export function Typography() {
  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">Typography</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Headings</h3>
          <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h1>Heading 1</h1>
              <p className="text-sm text-gray-500 mt-1">3rem / 48px, font-weight: 800</p>
            </div>
            <div>
              <h2>Heading 2</h2>
              <p className="text-sm text-gray-500 mt-1">2.25rem / 36px, font-weight: 700</p>
            </div>
            <div>
              <h3>Heading 3</h3>
              <p className="text-sm text-gray-500 mt-1">1.875rem / 30px, font-weight: 600</p>
            </div>
            <div>
              <h4>Heading 4</h4>
              <p className="text-sm text-gray-500 mt-1">1.5rem / 24px, font-weight: 600</p>
            </div>
            <div>
              <h5>Heading 5</h5>
              <p className="text-sm text-gray-500 mt-1">1.25rem / 20px, font-weight: 600</p>
            </div>
            <div>
              <h6>Heading 6</h6>
              <p className="text-sm text-gray-500 mt-1">1.125rem / 18px, font-weight: 600</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Body Text</h3>
          <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-base">
                This is the standard body text used throughout the application. It has a font size of 1rem (16px) and a line height of 1.5. 
                The text color adapts to light and dark mode for optimal readability.
              </p>
              <p className="text-sm text-gray-500 mt-1">1rem / 16px, line-height: 1.5</p>
            </div>
            
            <div>
              <p className="text-sm">
                This is smaller text often used for secondary information, captions, or metadata. 
                It has a font size of 0.875rem (14px) and maintains good readability.
              </p>
              <p className="text-sm text-gray-500 mt-1">0.875rem / 14px, line-height: 1.5</p>
            </div>
            
            <div>
              <p className="text-xs">
                This is extra small text used for fine print, footnotes, or very secondary information.
                It has a font size of 0.75rem (12px).
              </p>
              <p className="text-sm text-gray-500 mt-1">0.75rem / 12px, line-height: 1.5</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Text Styles</h3>
          <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-bold">Bold text - font-weight: 700</p>
            </div>
            <div>
              <p className="font-semibold">Semibold text - font-weight: 600</p>
            </div>
            <div>
              <p className="font-medium">Medium text - font-weight: 500</p>
            </div>
            <div>
              <p className="font-normal">Regular text - font-weight: 400</p>
            </div>
            <div>
              <p className="italic">Italic text</p>
            </div>
            <div>
              <p className="underline">Underlined text</p>
            </div>
            <div>
              <p className="text-gradient">Gradient text</p>
            </div>
            <div>
              <a href="#" className="text-primary-600 hover:text-primary-700">Link text with hover state</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
