import React from 'react';
import { Link } from 'react-router-dom';
import './about.css';

const About = () => (
    <div className="pages about-page">
        <div className="about-content">
            <h3 className="animated fadeInDown">About</h3>
            <p className="animated fadeInDown delayed-3s"><Link to="/">Reacting Notes</Link> is a note taking app built with Reactjs.</p>
            <p className="animated fadeInDown delayed-3s"> <a rel="noopener noreferrer" href="//manojbarman.in" target="_blank">Manoj Barman</a> &copy; 2018</p>
        </div>
    </div>
);

export default About;