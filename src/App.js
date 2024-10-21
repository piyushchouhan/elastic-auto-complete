import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

function App() {
    const [searchTerm, setSearchTerm] = useState(''); // Input value
    const [suggestions, setSuggestions] = useState([]); // Autocomplete suggestions
    const [loading, setLoading] = useState(false); // Loading state

    // Function to handle input change and fetch suggestions from the backend
    const handleSearch = async (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        if (query.length > 2) {
            setLoading(true);

            try {
                // Replace this URL with your actual backend autocomplete API endpoint
                const response = await axios.get('http://localhost:3001/api/search/internal', {
                    params: { q: query, index: 'doctor', fields: 'user.phone' }
                });

                // Extract suggestions from the response (assuming data contains the list of doctors)
                const suggestionsData = response.data.data.map(item => item.user.phone); // Extract user names
                setSuggestions(suggestionsData); // Update suggestions array
            } catch (error) {
                console.error('Error fetching autocomplete suggestions:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setSuggestions([]); // Clear suggestions when input is too short
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>Search with Autocomplete</h1>

            {/* Autocomplete component from Material-UI */}
            <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => option} // Each option is a string (user name)
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        onChange={handleSearch}
                        value={searchTerm}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
}

export default App;
