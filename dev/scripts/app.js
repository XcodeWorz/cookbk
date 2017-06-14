import React from 'react';
import ReactDOM from 'react-dom';
//Firebase Import.
import firebase, { auth, database, provider } from './firebase.js';
//Router Import.
import {
  BrowserRouter as Router,
  Route, NavLink as Link
} from 'react-router-dom';
//Routes Card Import
import Public from './public.js';
import Main from './main.js';
import Favourites from './favourites.js';

//This will be the be-all Main App Component. 

class App extends React.Component {
    constructor() {
      super();
      this.state = {
        recipe: {
          recTitle: '',
          recIngr: '',
          recDir: '',
          recImg: '',
          public: false
        },
        pastRecipe: [],
        user: null,
        loggedIn: false
      }

      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);

    }
    login() {
      auth.signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          this.setState({
            user: user,
            loggedIn: true
          })
        })
    }
    logout() {
      auth.signOut()
        .then(() =>{
          this.setState({
            user: null,
            loggedIn: false
          })
        });
    }
    //This is to render the landing for non logged in people as well as when they are logged in.
    render() {
        const recipeForm = () => {
          if (this.state.loggedIn === true) {
            return(
              <Router>
                <div>
                  {/*Header Section on Login*/}
                    <header className="user-header">
                      <h2>Hello {this.state.user.displayName}!</h2>
                      <button onClick={this.logout}>Logout</button>
                    </header>
                    <section className="main-home">
                      <div className="links">
                        <div className="link-button main-button">
                          <Link to='/' className='link-button_link'>Main</Link>
                        </div>
                        <div className="link-button public-button">
                          <Link to={`/public/${this.state.user.uid}`} className='link-button_link'>Public</Link>
                        </div>
                        <div className="link-button favourite-button">
                          <Link to={`/favourites/${this.state.user.uid}`} className='link-button_link'>Favourites</Link>
                        </div>
                      </div>
                      <Route path='/favourites/:user' component={Favourites} />
                      <Route path='/public/:user' component={Public} />
                      <Route exact path='/' component={Main} />
                    </section>

                </div>
              </Router>

            )
          }
          else{
            return(
              //Landing Page Log in for Users
              <div className="homepage">
                <div className="homepage__titles">
                  <h2>Welcome to</h2>
                  <h1>CookBook</h1>
                  <h3>A Site For You to Store Recipes</h3>
                  <button onClick={this.login}>Sign In with Google</button>
                </div>
              </div>
            )
          }
        }
        return (
          <div>
            {recipeForm()}
          </div>
        )
    }

    //User Auth.
    componentDidMount() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            user,
            loggedIn: true
          })
          const userId = user.uid;
          const userRef = firebase.database().ref(userId);

          userRef.on('value', (snapshot) => {
            const dbRecipes = snapshot.val();
            const newRecipes = [];
            for (let key in dbRecipes) {
              newRecipes.push({
                key: key,
                description: dbRecipes[key] 
              });
            }
            this.setState({
              pastRecipe: newRecipes
            });
          });
        }
        else {
          this.setState({
            user: null,
            loggedIn: false
          })
        }
      })
      
    }
}


ReactDOM.render(<App />, document.getElementById('app'));