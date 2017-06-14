import React from 'react';
import firebase, { auth, database, provider } from './firebase.js';

export default class Public extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			publicRec: []
		}
		this.addFavourites = this.addFavourites.bind(this);
	}
	addFavourites(favKey) {
		const favId = this.props.match.params.user
		const favRef = firebase.database().ref(`${favId}/favourites`)
		const favRec = Object.assign({}, favKey)
		favRef.push(favRec);
	}
	componentDidMount(){
		const publicRef = firebase.database().ref('/public');
		publicRef.on('value', (snapshot) => {
			let publicArray = [];
			const publicStuff = snapshot.val()
			console.log(publicStuff);
			for (let key in publicStuff) {
				publicArray.push({
					key: key,
					recImg: publicStuff[key].recImg,
					recTitle: publicStuff[key].recTitle,
					recDir: publicStuff[key].recDir,
					recIngr: publicStuff[key].recIngr
				})
				this.setState({
					publicRec: publicArray
				})
				console.log(this.state.publicRec);
			}

		})
	}
	render(){
		return(
			<section className="public-main">
				<h2>Public Recipes</h2>
				<div className="public-section">
					{this.state.publicRec.map((publicCard) => {
						return(
							<div className="recipe-card public-card" key={publicCard.key}>
								<div className="recipe-img">
									<img src={publicCard.recImg} alt=""/>
								</div>
								<div className="recipe-text">
									<h3>{publicCard.recTitle}</h3>
									<p>{publicCard.recIngr}</p>
									<p>{publicCard.recDir}</p>
									<div className="favourite">
										<div className="favourite-click" onClick={() => this.addFavourites(publicCard)}>
											<p>Add to Favourites</p>
											<i className="fa fa-star" aria-hidden="true"></i>
										</div>
									</div>
								</div>
							</div>
						)
					}).reverse()}
				</div>
			</section>
		)
	}
}