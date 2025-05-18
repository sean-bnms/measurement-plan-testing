export default function TemplateSidePanel() {
      return (
        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Get started with Templates</h2>
          <p className="text-sm text-gray-600 mb-4">Browse pre-made configurations used by teams like yours.</p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li><a href="#">Google Analytics 4 E-commerce</a></li>
            <li><a href="#">Meta Ads Conversion Tracking</a></li>
            <li><a href="#">Salesforce Attribution</a></li>
          </ul>
          <p className="text-xs text-gray-600 mt-4">Templates are curated from our community and verified by experts.</p>
        </div>
      );
    }
  