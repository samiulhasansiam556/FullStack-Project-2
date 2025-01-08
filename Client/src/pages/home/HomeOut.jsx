

import NavOut from '../../components/nav/NavOut';
import backgroundImage from '../../assets/background.jpg'; 

function HomeOut() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col text-white"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <NavOut /> 
            <div className="flex-grow flex flex-col justify-center items-center mt-10">
                <div className="text-center p-5 bg-black bg-opacity-50 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Welcome to ECOMERCE</h1>
                    <p className="text-lg mb-8">Become a part of ecomerce! Join our community and explore ideas, guides, and stories that empower you to live your best life.</p>
                    <p className="text-md">Sign in or Sign up to get started!</p>
                </div>
            </div>
        </div>
    );
}

export default HomeOut;