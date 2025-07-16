import { useState } from "react";
import AdminNavBar from "./AdminNav";
import CategoryList from "./CategoryList";
import CategoryCreate from "./CategoryCreate";
import ProductList from "./ProductList";
import ProductCreate from "./ProductCreate";
import BestProduct from "./BestProduct";
import AddCoverImages from "./AddCoverImages";
import AdminOrders from "../pages/Order/AdminOrder";

import { HiMenu, HiX } from "react-icons/hi"; // HeroIcons for menu toggle

function AdminDashboard() {
  const [selectedFeature, setSelectedFeature] = useState("CategoryList");
  const [showSidebar, setShowSidebar] = useState(false);

  const renderFeature = () => {
    switch (selectedFeature) {
      case "CategoryList":
        return <CategoryList />;
      case "CategoryCreate":
        return <CategoryCreate />;
      case "ProductList":
        return <ProductList />;
      case "ProductCreate":
        return <ProductCreate />;
      case "BestProduct":
        return <BestProduct />;
      case "AddCoverImages":
        return <AddCoverImages />;
      case "Order":
        return <AdminOrders />;
      default:
        return <CategoryList />;
    }
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowSidebar(false); // Close sidebar on mobile when link is clicked
  };

  return (
    <>
      <AdminNavBar />

      <div className="flex h-screen relative">
        {/* ✅ Mobile Menu Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded-md"
        >
          {showSidebar ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* ✅ Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-8 space-y-4 flex flex-col items-start transform transition-transform duration-300 md:static md:translate-x-0 w-64 ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <button
            onClick={() => handleFeatureClick("CategoryList")}
            className="text-left w-full"
          >
            Categories
          </button>
          <button
            onClick={() => handleFeatureClick("CategoryCreate")}
            className="text-left w-full"
          >
            Create Category
          </button>
          <button
            onClick={() => handleFeatureClick("ProductList")}
            className="text-left w-full"
          >
            Products
          </button>
          <button
            onClick={() => handleFeatureClick("ProductCreate")}
            className="text-left w-full"
          >
            Create Product
          </button>
          <button
            onClick={() => handleFeatureClick("BestProduct")}
            className="text-left w-full"
          >
            Best Product
          </button>
          <button
            onClick={() => handleFeatureClick("AddCoverImages")}
            className="text-left w-full"
          >
            Add Cover Images
          </button>
          <button
            onClick={() => handleFeatureClick("Order")}
            className="text-left w-full"
          >
            Orders
          </button>
        </aside>

        {/* ✅ Main Content */}
        <main className="flex-1 p-8 bg-gray-100 overflow-auto w-full md:ml-64">
          {renderFeature()}
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
