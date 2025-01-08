import React from 'react';
import NavIn from '../../components/nav/NavIn';

function About() {
  return (


    <div>

        <div>
            <NavIn></NavIn>
        </div>
    <div className="container mx-auto px-6 py-12 bg-white text-gray-800">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">About Us</h1>

      {/* Company Introduction Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Story</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to E-Commerce! We are passionate about providing high-quality products and exceptional service to our customers.
          Our journey began with a simple mission: to make shopping easy, accessible, and enjoyable for everyone.
        </p>
      </section>

      {/* Mission and Values */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Mission & Values</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Our mission is to bring the best products to your doorstep, backed by our commitment to quality and customer satisfaction.
          We believe in transparency, trust, and treating our customers like family.
        </p>
        <ul className="list-disc list-inside text-lg space-y-2 pl-4">
          <li><span className="font-semibold text-blue-600">Quality:</span> We prioritize high-quality products and services.</li>
          <li><span className="font-semibold text-blue-600">Customer First:</span> Your satisfaction is our top priority.</li>
          <li><span className="font-semibold text-blue-600">Innovation:</span> We continually improve to serve you better.</li>
          <li><span className="font-semibold text-blue-600">Integrity:</span> Honesty and transparency in everything we do.</li>
        </ul>
      </section>

      {/* Meet the Team */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Meet the Team</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Our dedicated team is here to ensure your experience with us is nothing short of excellent. Each team member brings unique skills
          and passion to make our e-commerce platform outstanding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="/path/to/team-member1.jpg"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-xl font-bold text-gray-800">Alice Johnson</h3>
            <p className="text-gray-500">CEO & Founder</p>
          </div>
          <div className="text-center">
            <img
              src="/path/to/team-member2.jpg"
              alt="Team Member 2"
              className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-xl font-bold text-gray-800">John Smith</h3>
            <p className="text-gray-500">CTO</p>
          </div>
          <div className="text-center">
            <img
              src="/path/to/team-member3.jpg"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-xl font-bold text-gray-800">Jane Doe</h3>
            <p className="text-gray-500">Head of Customer Service</p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="text-center mt-12 bg-blue-100 py-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-2">We’d love to hear from you!</p>
        <p className="text-lg text-gray-700">Email: <a href="mailto:support@ecommerce.com" className="text-blue-600 hover:underline">support@ecommerce.com</a></p>
        <p className="text-lg text-gray-700">Phone: +1 (234) 567-890</p>
      </section>
    </div>


    </div>
  );
}

export default About;
