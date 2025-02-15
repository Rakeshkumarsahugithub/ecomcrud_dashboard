  import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column">
            <header className="text-center py-5 bg-white shadow mb-4">
                <h1 className="display-4">Welcome to Our E-Commerce Platform</h1>
                <p>Your gateway to effortless product management and seamless shopping experience.</p>
            </header>

            <section className="text-center py-5">
                <h2 className="mb-5">Features</h2>
                <div className="row justify-content-center">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3>Manage Products</h3>
                                <p>Easily add, update, or delete products in your inventory.</p>
                                <Link to="/products" className="btn btn-primary">View Products</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3>Add New Products</h3>
                                <p>Quickly add new products with an intuitive interface.</p>
                                <Link to="/add-product" className="btn btn-primary">Add Product</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3>Secure Authentication</h3>
                                <p>Enjoy secure login and logout functionality to protect your data.</p>
                                <Link to="/login" className="btn btn-primary">Log In</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-white py-3 mt-auto">
                <p className="text-center m-0">© 2024 E-Commerce Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
