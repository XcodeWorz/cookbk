import React from 'react';
import firebase, { auth, database, provider } from './firebase.js';

export default class Favourites extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			favouriteRec: []
		}
	}
	//To Remove Favourite
	removeFavourite(recipeId) {
		const removeId = this.props.match.params.user
	    firebase.database().ref(`${removeId}/favourites/${recipeId}`).remove();
	}
	//To append favourites to the User 'Favourites' in Firebase
	componentDidMount() {
		const favUser = this.props.match.params.user
		const favouriteRef = firebase.database().ref(`${favUser}/favourites`)
		favouriteRef.on('value', (snapshot) => {
			let favouriteArray = [];
			const favouriteStuff = snapshot.val()
			for (let key in favouriteStuff) {
				favouriteArray.push({
					key: key,
					recImg: favouriteStuff[key].recImg,
					recTitle: favouriteStuff[key].recTitle,
					recDir: favouriteStuff[key].recDir,
					recIngr: favouriteStuff[key].recIngr
				})
				this.setState({
					favouriteRec: favouriteArray
				})
			}

		})
	}
	//Rendering to the Favourite page
	render(){
		return(
			<section className="fav-main">
				<h2>Favourited Recipes</h2>
				<div className="favourite-section">
					{this.state.favouriteRec.map((favouriteCard) => {
						return(
							<div className="recipe-card favourite-card" key={favouriteCard.key}>
								<div className="recipe-img">
									<img src={favouriteCard.recImg} alt=""/>
								</div>
								<div className="recipe-text">
									<h3>{favouriteCard.recTitle}</h3>
									<p>{favouriteCard.recIngr}</p>
									<p>{favouriteCard.recDir}</p>
									<div className="delete-post" onClick={() => this.removeFavourite(favouriteCard.key)}>
										<i className="fa fa-times"></i>
										<p>Remove Post</p>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</section>
		)
	}
}