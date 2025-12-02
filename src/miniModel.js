/**
 * Used for test and debug purposes, remove the file later
 */

import { useState, useEffect } from "react";

// Function to create a simple observable model
export function createMiniModel() {
    // Array to store observer functions (subscribers)
    let observers = [];

    const model = {
        // State of a promise: holds the promise itself, its resolved data, or an error
        promiseState: {
            promise: null,  // the actual Promise object
            data: null,     // resolved value of the promise
            error: null     // error if the promise rejects
        },

        // An observer (callback) to be notified when the model changes
        addObserver: function(obs) { 
            observers.push(obs); 
        },

        // Remove an observer from the list
        removeObserver: function(obs) { 
            observers = observers.filter(function(o) { return o !== obs; }); 
        },

        // Notify all observers by calling their callback functions
        notifyObservers: function() { 
            observers.forEach(function(o) { o(); }); 
        }
    };

    return model;
}

// Custom React hook to subscribe a component to the model
export function useModel(model) {
    // State used just to force a re-render when the model updates
    const [, setVersion] = useState(0);

     useEffect(function() {
        // Observer function: increments version to trigger re-render
        function observer() {
            setVersion(function(v) { return v + 1; });  // force re-render
        }

        // Register the observer to the model
        model.addObserver(observer);

        // Cleanup: remove the observer when component unmounts or model changes
        return function() { model.removeObserver(observer); };
    }, [model]);    // only re-run effect if the model reference changes

    return model;
}