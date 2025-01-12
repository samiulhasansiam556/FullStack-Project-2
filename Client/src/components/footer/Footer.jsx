import React from 'react'

export default function Footer() {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-200 py-12">
  <div className="container mx-auto px-6 md:px-12">
    {/* Footer Top Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* About Us */}
      <div>
        <h4 className="text-lg font-semibold mb-4">About Us</h4>
        <p className="text-sm">
          Welcome to our e-commerce platform! We provide the best products at affordable prices with unmatched customer service.
        </p>
      </div>

      {/* Customer Service */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="/help" className="hover:text-blue-400 transition">
              Help Center
            </a>
          </li>
          <li>
            <a href="/returns" className="hover:text-blue-400 transition">
              Returns & Refunds
            </a>
          </li>
          <li>
            <a href="/shipping" className="hover:text-blue-400 transition">
              Shipping Policy
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-blue-400 transition">
              FAQs
            </a>
          </li>
        </ul>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="/about" className="hover:text-blue-400 transition">
              About Us
            </a>
          </li>
          <li>
            <a href="/products" className="hover:text-blue-400 transition">
              Products
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-blue-400 transition">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:text-blue-400 transition">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      {/* Social Media */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
            <i className="fab fa-twitter fa-lg"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
            <i className="fab fa-instagram fa-lg"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
        </div>
      </div>
    </div>

    {/* Footer Bottom Section */}
    <div className="mt-12 border-t border-gray-700 pt-6 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
      <p className="text-xs mt-2">
        Made with ❤️ by <a href="#" className="text-blue-400 hover:underline">Your Name</a>.
      </p>
    </div>
  </div>
</footer>

    </div>
  )
}
