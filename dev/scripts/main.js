import React from 'react';
import ReactDOM from 'react-dom';
//Firebase Import.
import firebase, { auth, database, provider } from './firebase.js';
//Router Import.
import {
  BrowserRouter as Router,
  Route, NavLink as Link
} from 'react-router-dom';
//RecipeCard import
import RecipeCard from './recipeCard.js';

export default class Main extends React.Component{
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

	  this.makePublic = this.makePublic.bind(this);
	  this.addRecipe = this.addRecipe.bind(this);
	  this.photoUpload = this.photoUpload.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	  this.handleChange = this.handleChange.bind(this);
	  this.logout = this.logout.bind(this);

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
	//Photo upload Section shout out to everyone at Cohort 14 that helped!!
	photoUpload(e) {
	  let file = e.target.files[0];
	  const storageRef = firebase.storage().ref('userPhotos/' + file.name)
	  const task = storageRef.put(file).then(() => {
	    const urlObject = storageRef.getDownloadURL().then((data) => {
	      const recipe = Object.assign({},this.state.recipe);
	      recipe.recImg = data;
	      this.setState({recipe})
	    })
	  });
	}

	//This is to add a new Recipe!
	addRecipe(e){
	  e.preventDefault();
	  this.recipeform.classList.toggle('show');
	}
	//This handles any change on the form.
	handleChange(e) {
	  const recipes = Object.assign({}, this.state.recipe);
	  recipes[e.target.name] = e.target.value
	  this.setState({     
	      recipe: recipes
	  })
	}

	//This is to submit the data to firebase.
	handleSubmit(e) {
	  e.preventDefault();
	  const userId = this.state.user.uid
	  const userRef = firebase.database().ref(userId)
	  userRef.push(this.state.recipe);
	  this.setState({
	    recipe: {
	      recTitle: '',
	      recIngr: '',
	      recDir: '',
	      recImg: ''
	    }
	  })
	  this.addRecipe(e);
	}

	//This is to delete the recipe from the page as well as firebase.
	removeRecipe(recipeId) {
	  if(this.state.user) {

	    firebase.database().ref(`${this.state.user.uid}/${recipeId}`).remove();
	  } 
	}

	//This is to push to the 'Public' page for any user to see
	makePublic(publicId) {
	  let pubRec = Object.assign({}, publicId)
	  let pubId = firebase.database().ref('/public');
	  pubId.push(pubRec);
	}

	render(){
		return(
			<div>
				{/*This is the new recipe form*/}
			  <aside className="recipeform" ref={ref => this.recipeform = ref}>
			    <form onSubmit={this.handleSubmit}>
			      <div className="close-button" onClick={this.addRecipe}>
			        <p>Close</p>
			        <i className="fa fa-times"></i>
			      </div>
			      <div className="labels-inputs">
			        <label htmlFor="recTitle">Recipe Title:</label>
			        <input name="recTitle" onChange={this.handleChange} type="text" value={this.state.recipe.recTitle} placeholder="Enter your Recipe Title!"/>
			        <label htmlFor="recImg">Upload an Image! (Max 3MB)</label>
			        <input name="recImg" type="file" onChange={this.photoUpload} accept="image/*" />
			        <label htmlFor="recIngr">Ingredients:</label>
			        <textarea name="recIngr" onChange={this.handleChange} value={this.state.recipe.recIngr} id="ingredients" placeholder="Add some Ingredients!"></textarea>
			        <label htmlFor="recDir">Directions:</label>
			        <textarea name="recDir" value={this.state.recipe.recDir} id="directions" onChange={this.handleChange} placeholder="Enter your Directions"></textarea>
			        <input type="submit"/>
			      </div>
			    </form>
			  </aside>

			{/*This is the Recipe Card Section*/}
			  <div className="main-section">
			    <div className="recipe-card add-new">
			      <h2>Add A New Recipe!</h2>
			      <i className="fa fa-plus-circle" aria-hidden="true" onClick={this.addRecipe}></i>
			    </div>
			    {this.state.pastRecipe.map((recipePost) => {
			      return (
			        <div className="recipe-card" key={recipePost.key}>
			          <RecipeCard recipePost={recipePost} />
			          <div className="delete-button">
			          	<div className="delete-post" onClick={() => this.removeRecipe(recipePost.key)}>
				            <i className="fa fa-times" ></i>
				            <p>Delete Post</p>
			          	</div>
			            <div className="make-public" onClick={() => this.makePublic(recipePost.description)}>
			            	<p>Make Public</p>
				            <i className="fa fa-eye" aria-hidden="true" ></i>
			            </div>
			          </div>
			        </div>
			      )
			    }).reverse()}
			  </div>
			</div>
		)
	}

	//This is for the user auth and to retrieve the data from firebase to push to a new array
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
	        	if (key !== 'favourites') {
	          		newRecipes.push({
	            		key: key,
	            		description: dbRecipes[key] 
	          		});
	      		}
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