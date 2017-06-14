import React from 'react';

//This is for the main page Render.
export default function(props) {
	return(
		<section>
			<div className="recipe-img">
				<img src={props.recipePost.description.recImg} alt=""/>
			</div>
			<div className="recipe-text">
				<h3>{props.recipePost.description.recTitle}</h3>
				<p>{props.recipePost.description.recIngr}</p>
				<p>{props.recipePost.description.recDir}</p>
			</div>
		</section>
	)
}