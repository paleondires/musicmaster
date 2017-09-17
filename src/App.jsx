import React, {Component} from 'react';
import './App.css';
import {FormControl, FormGroup, Glyphicon, InputGroup} from 'react-bootstrap';
import Profile from './Profile'
import Gallery from './Gallery'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            artist: null,
            tracks: []
        }
    }

    //Search for an artist based on the state query
    search() {
        const BASE_SEARCH_URL = 'https://api.spotify.com/v1/search/?';
        let FETCH_URL = `${BASE_SEARCH_URL}q=${this.state.query}&type=artist&limit=1`;
        const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
        const ACCESS_TOKEN = 'BQAclmhXvg7O83vz-zFeq4kEH08plMpu9A9rkeYv-GOdp36yo5a3VmPYcngO2hnXbyRMlKh-Ct4cQ4NsG9GVJkSHL0eZ2c0X2Kr7hMd0MbiNwUcwaqKNEqTdhF3-mhKl2J3VIzFRnZtNyecV1NXHsHAtsm3vuOSD0EU';
        const httpOpts = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            mode: 'cors',
            cache: 'default'
        };
        fetch(FETCH_URL, httpOpts)
            .then(response => response.json())
            .then(json => {
                const artists = json.artists.items;
                if (artists) {
                    const artist = artists[0];
                    this.setState({artist})
                    FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`;
                    fetch(FETCH_URL, httpOpts)
                        .then(response => response.json())
                        .then(json => {
                            console.log('artist\'s top tracks:', json);
                            //declare tracks as json.tracks
                            const {tracks} = json;
                            this.setState({tracks});
                        })
                }
            });
    }

    //TODO Implement spotify authorization (Instead of getting ACCESS_TOKEN manually via spotify example app)
    authorize() {

    }

    render() {
        return (
            <div className="App">
                <div className="app-title">Music Master</div>
                <div>
                    <FormGroup>
                        <InputGroup>
                            <FormControl type="text"
                                         placeholder="Search for an artist..."
                                         value={this.state.query}
                                         onChange={event => this.setState({query: event.target.value})}
                                         onKeyPress={event => {
                                             if (event.key === 'Enter') this.search()
                                         }}/>
                            <InputGroup.Addon onClick={() => this.search()}>
                                <Glyphicon glyph="search"/>
                            </InputGroup.Addon>
                        </InputGroup>
                    </FormGroup>
                    {
                        this.state.artist !== null
                            ?
                            <div>
                                <Profile
                                    artist={this.state.artist}
                                />
                                <Gallery
                                    tracks={this.state.tracks}
                                />
                            </div> : <div></div>
                    }
                </div>
            </div>
        )
    }
}

//Export the app component so it can be referenced elsewhere
export default App;