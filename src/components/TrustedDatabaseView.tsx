import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { TrustedProduct } from '../types';
import { fetchTrustedCatalog } from '../services/api';

interface TrustedDatabaseViewProps {
  onSelectProductForScan: (productName: string) => void;
}

export const TrustedDatabaseView: React.FC<TrustedDatabaseViewProps> = ({
  onSelectProductForScan,
}) => {
  const [products, setProducts] = useState<TrustedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBand, setSelectedBand] = useState<string>('all');

  useEffect(() => {
    fetchTrustedCatalog()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching catalog:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.approvedCrops.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.targetPests.some((pest) => pest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.cibrcRegNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBand = selectedBand === 'all' || p.toxicityBand.toLowerCase() === selectedBand.toLowerCase();

    return matchesSearch && matchesCategory && matchesBand;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Step 5 • Authorized Data Store
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Authorized Seed &amp; Agro-Chemical Registry
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Central Insecticides Board &amp; Registration Committee (CIB&amp;RC) and Indian National Seed Registry benchmarks. AgriScanner compares user label scans against these verified standards to guarantee authentic dosage, crop approvals, and antidote instructions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <div className="text-xs">
            <div className="font-extrabold text-emerald-950">Statutory Compliance</div>
            <div className="text-emerald-700 font-medium">Government Standards</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by chemical name, crop (e.g. Paddy, Cotton), target pest, or CIR reg no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="cat-filter" className="text-xs font-bold text-slate-600 shrink-0">Category:</label>
          <select
            id="cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="insecticide">Insecticides</option>
            <option value="fungicide">Fungicides</option>
            <option value="herbicide">Herbicides</option>
            <option value="seed">Certified Seeds</option>
            <option value="bio-stimulant">Bio-Pesticides</option>
          </select>
        </div>

        {/* Toxicity Band Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="band-filter" className="text-xs font-bold text-slate-600 shrink-0">Toxicity Band:</label>
          <select
            id="band-filter"
            value={selectedBand}
            onChange={(e) => setSelectedBand(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto"
          >
            <option value="all">All Bands</option>
            <option value="red">Red (Extremely Toxic)</option>
            <option value="yellow">Yellow (Highly Toxic)</option>
            <option value="blue">Blue (Moderately Toxic)</option>
            <option value="green">Green (Caution / Safe)</option>
          </select>
        </div>
      </div>

      {/* Product Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Loading authorized benchmarks...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800">No matching registry records found</h4>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const isRed = product.toxicityBand === 'Red';
            const isYellow = product.toxicityBand === 'Yellow';
            const isBlue = product.toxicityBand === 'Blue';

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Toxicity Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {product.cibrcRegNo}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {product.genericName}
                      </p>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 border ${
                        isRed
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : isYellow
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : isBlue
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {product.toxicityBand} Band
                    </div>
                  </div>

                  {/* Manufacturer & Category */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 font-medium">
                    <span>Mfr: {product.manufacturer}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-800">{product.category}</span>
                  </div>

                  {/* Standard Dosage & Waiting Period */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">Standard Approved Dosage: </span>
                      <span className="font-semibold text-emerald-800">{product.standardDosage}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Waiting Period before Harvest: </span>
                      <span className="font-semibold text-slate-900">{product.waitingPeriodDays} Days</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Active Formulation: </span>
                      <span>{product.activeIngredients}</span>
                    </div>
                  </div>

                  {/* Approved Crops & Targets */}
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Approved Crops &amp; Target Pests:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {product.approvedCrops.map((crop, i) => (
                        <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                          {crop}
                        </span>
                      ))}
                      {product.targetPests.slice(0, 3).map((pest, i) => (
                        <span key={`p-${i}`} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {pest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Antidote */}
                  <div className="mt-3 text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-lg border border-rose-100">
                    <span className="font-bold">Medical Antidote: </span>
                    {product.antidote}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-500">Barcode: {product.barcode}</span>
                  <button
                    onClick={() => onSelectProductForScan(product.name)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Test Scan in AgriScanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
