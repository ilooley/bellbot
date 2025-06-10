"use client";

interface ColorSwatchProps {
  name: string;
  variable: string;
  textColor?: string;
}

function ColorSwatch({ name, variable, textColor = "text-white" }: ColorSwatchProps) {
  return (
    <div className="flex flex-col">
      <div 
        className={`h-16 rounded-md mb-2 flex items-end p-2 ${textColor}`}
        style={{ background: `hsl(var(${variable}))` }}
      >
        {name}
      </div>
      <div className="text-xs text-gray-500">{variable}</div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">Color System</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorSwatch name="50" variable="--primary-50" textColor="text-gray-800" />
            <ColorSwatch name="100" variable="--primary-100" textColor="text-gray-800" />
            <ColorSwatch name="200" variable="--primary-200" textColor="text-gray-800" />
            <ColorSwatch name="300" variable="--primary-300" textColor="text-gray-800" />
            <ColorSwatch name="400" variable="--primary-400" />
            <ColorSwatch name="500" variable="--primary-500" />
            <ColorSwatch name="600" variable="--primary-600" />
            <ColorSwatch name="700" variable="--primary-700" />
            <ColorSwatch name="800" variable="--primary-800" />
            <ColorSwatch name="900" variable="--primary-900" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Secondary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorSwatch name="50" variable="--secondary-50" textColor="text-gray-800" />
            <ColorSwatch name="100" variable="--secondary-100" textColor="text-gray-800" />
            <ColorSwatch name="200" variable="--secondary-200" textColor="text-gray-800" />
            <ColorSwatch name="300" variable="--secondary-300" textColor="text-gray-800" />
            <ColorSwatch name="400" variable="--secondary-400" />
            <ColorSwatch name="500" variable="--secondary-500" />
            <ColorSwatch name="600" variable="--secondary-600" />
            <ColorSwatch name="700" variable="--secondary-700" />
            <ColorSwatch name="800" variable="--secondary-800" />
            <ColorSwatch name="900" variable="--secondary-900" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorSwatch name="50" variable="--accent-50" textColor="text-gray-800" />
            <ColorSwatch name="100" variable="--accent-100" textColor="text-gray-800" />
            <ColorSwatch name="200" variable="--accent-200" textColor="text-gray-800" />
            <ColorSwatch name="300" variable="--accent-300" textColor="text-gray-800" />
            <ColorSwatch name="400" variable="--accent-400" />
            <ColorSwatch name="500" variable="--accent-500" />
            <ColorSwatch name="600" variable="--accent-600" />
            <ColorSwatch name="700" variable="--accent-700" />
            <ColorSwatch name="800" variable="--accent-800" />
            <ColorSwatch name="900" variable="--accent-900" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Gray Scale</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorSwatch name="50" variable="--gray-50" textColor="text-gray-800" />
            <ColorSwatch name="100" variable="--gray-100" textColor="text-gray-800" />
            <ColorSwatch name="200" variable="--gray-200" textColor="text-gray-800" />
            <ColorSwatch name="300" variable="--gray-300" textColor="text-gray-800" />
            <ColorSwatch name="400" variable="--gray-400" textColor="text-gray-800" />
            <ColorSwatch name="500" variable="--gray-500" />
            <ColorSwatch name="600" variable="--gray-600" />
            <ColorSwatch name="700" variable="--gray-700" />
            <ColorSwatch name="800" variable="--gray-800" />
            <ColorSwatch name="900" variable="--gray-900" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Success" variable="--success" />
            <ColorSwatch name="Warning" variable="--warning" textColor="text-gray-800" />
            <ColorSwatch name="Error" variable="--error" />
            <ColorSwatch name="Info" variable="--info" />
          </div>
        </div>
      </div>
    </section>
  );
}
