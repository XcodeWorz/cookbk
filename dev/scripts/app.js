import React from 'react';
import ReactDOM from 'react-dom';
//Firebase Import.
import firebase, { auth, database, provider } from './firebase.js';
//Router Import.
import {
  BrowserRouter as Router,
  Route, NavLink as Link
} from 'react-router-dom';

//This will be the be-all Main App Component.
class App extends React.Component {
    constructor() {
      super();
      this.state = {
        recipe: {
          recTitle: '',
          recImg: '',
          recIngr: '',
          recDir: ''
        },
        pastRecipe: [],
        user: null,
        loggedIn: false
      }

      this.photoUpload = this.photoUpload.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
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
    //Shoutout to Courtney Labog and Shannon Draper for helping with this.
    //This is what stores the photo upload and url to the Recipe Object to then be later stored on Firebase.
    photoUpload(e) {
      let file = e.target.files[0];
      console.log(file.name);
      const storageRef = firebase.storage().ref('userPhotos/' + file.name)
      const task = storageRef.put(file).then(() => {
            const urlObject = storageRef.getDownloadURL().then((data) => {
              this.setState({
                recipe: {
                  recImg: data
                }
              })
            })
          });
    }
    handleChange(e) {
      const recipes = Object.assign({}, this.state.recipe);
      let value = e.target.value;
      // console.log(e.target.value);
      recipes[e.target.name] = value; //Bracket notation to equal vaule
      console.log(recipes);
      // console.log(recipes[e.target.name])

        this.setState({
          recipe: recipes
        })
    }
    handleSubmit(e) {
      e.preventDefault();
      const userId = this.state.user.uid
      const userRef = firebase.database().ref(userId)
      userRef.push(this.state.recipe);
      this.setState({
        recipe: {
          recTitle: '',
          recImg: '',
          recIngr: '',
          recDir: ''
        }
      })
    }
    render() {
        const recipeForm = () => {
          if (this.state.loggedIn === true) {
            return(
              <div>
                <h1>CookBook!</h1>
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="recTitle">Recipe Title</label>
                  <input name="recTitle" onChange={this.handleChange} type="text" value={this.state.recipe.recTitle} placeholder="Enter your Recipe Title!"/>
                  <label htmlFor="recImg">Upload an Image!</label>
                  <input name="recImg" type="file" onChange={this.photoUpload} accept="image/*" />
                  <label htmlFor="recIngr">Ingredients</label>
                  <textarea name="recIngr" onChange={this.handleChange} value={this.state.recipe.recIngr} id="ingredients" placeholder="Add some Ingredients!" cols="30" rows="10"></textarea>
                  <label htmlFor="recDir">Directions</label>
                  <textarea name="recDir" value={this.state.recipe.recDir} id="directions" onChange={this.handleChange} placeholder="Enter your Directions" cols="30" rows="10"></textarea>
                  <input type="submit"/>
                </form>
                <ul>
                  {this.state.pastRecipe.map((recipePost) => {
                    return (
                      <li key={recipePost.key}>
                        <h2>{recipePost.description.recTitle}</h2>
                        <p>{recipePost.description.recIngr}</p>
                        <p>{recipePost.description.recDir}</p>
                        <img src={recipePost.description.recImg} alt=""/>
                      </li>
                    )
                  })}
                </ul>
                <button onClick={this.logout}>Logout!</button>
              </div>

            )
          }
          else{
            return(
              <div>
                {/* Just some simple homepage text for right now */}
                <h1>Welcome to CookBook!</h1>
                <h2>A Site to store Recipes!</h2>
                <button onClick={this.login}>Sign In!</button>
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
    componentDidMount() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
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
            console.log(newRecipes);
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



// 1. Have the user sign in using Google.
// 2. Display a "user-homepage
// 3. Have a form for people to fill out for recipe ideas as well as an image to be uploaded onto the page of the recipe thingy.
// 4.  



// If the user is signed in then firebase will be called.
// The data firebase will be updated into state.
// The "pastRecipes" array will then be posted on page.





ReactDOM.render(<App />, document.getElementById('app'));