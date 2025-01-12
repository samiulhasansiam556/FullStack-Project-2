import { useState } from "react";
import AdminNavBar from "./AdminNav";
import CategoryList from "./CategoryList";
import CategoryCreate from "./CategoryCreate";
import ProductList from "./ProductList";
import ProductCreate from "./ProductCreate";
import OrderList from "./OrderList";
import BestProduct from "./BestProduct";
import AddCoverImages from "./AddCoverImages";

function AdminDashboard() {
  const [selectedFeature, setSelectedFeature] = useState("CategoryList");

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
        return <BestProduct/>
      case "AddCoverImages" : 
        return <AddCoverImages/>; 
      case "OrderList":
        return <OrderList />;
      default:
        return <CategoryList />;
    }
  };

  return (
    <>
      <AdminNavBar />

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-8 space-y-4 flex flex-col items-start">
          <button
            onClick={() => setSelectedFeature("CategoryList")}
            className="text-left w-full"
          >
            Categories
          </button>
          <button
            onClick={() => setSelectedFeature("CategoryCreate")}
            className="text-left w-full"
          >
            Create Category
          </button>
          <button
            onClick={() => setSelectedFeature("ProductList")}
            className="text-left w-full"
          >
            Products
          </button>
          <button
            onClick={() => setSelectedFeature("ProductCreate")}
            className="text-left w-full"
          >
            Create Product
          </button>

          <button
            onClick={() => setSelectedFeature("BestProduct")}
            className="text-left w-full"
          >
            Best Product
          </button>
          
          <button
            onClick={() => setSelectedFeature("AddCoverImages")}
            className="text-left w-full"
          >
             Add Cover Images
          </button>
          <button
            onClick={() => setSelectedFeature("OrderList")}
            className="text-left w-full"
          >
            Orders
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100 overflow-auto">
          {renderFeature()}
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
