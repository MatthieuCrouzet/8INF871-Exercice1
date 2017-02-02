define([
  'sceneObject',
], (
  SceneObject
) => {
  'use strict';

  // # Classe *Scene*
  // La classe *Scene* représente la hiérarchie d'objets contenus
  // simultanément dans la logique du jeu.
  class Scene {
    // ## Fonction statique *create*
    // La fonction *create* permet de créer une nouvelle instance
    // de la classe *Scene*, contenant tous les objets instanciés
    // et configurés. Le paramètre `description` comprend la
    // description de la hiérarchie et ses paramètres. La fonction
    // retourne une promesse résolue lorsque l'ensemble de la
    // hiérarchie est configurée correctement.
    static create(description) {
	  return new Promise((resolve, reject) => {			  
		  const scene = new Scene();
		  scene.setup(description);
		  resolve(scene)
	  });
    }

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display(dT) {
		if(this.background)
			this.background.display(dT);
		if(this.ball)
			this.ball.display(dT);
		if(this.player1)
			this.player1.display(dT);
		if(this.player2)
			this.player2.display(dT);
		if(this.referee)
			this.referee.display(dT);
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update(dT) {
		if(this.background)
			this.background.update(dT);		
		if(this.ball)
			this.ball.update(dT);		
		if(this.player1)
			this.player1.update(dT);		
		if(this.player2)	
			this.player2.update(dT);
		if(this.referee)
			this.referee.update(dT);
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName) {
		var values = [];
		if(this.background){
			const bg = this.background.findObjectInObject(objectName);
			values.push(bg);
		}
		if(this.player1){
			const p1 = this.player1.findObjectInObject(objectName);
			values.push(p1);
		}
		if(this.player2){
			const p2 = this.player2.findObjectInObject(objectName);
			values.push(p2);
		}
		if(this.ball){
			const ball = this.ball.findObjectInObject(objectName);
			values.push(ball);
		}
		if(this.referee){
			const ref = this.referee.findObjectInObject(objectName);
			values.push(ref);
		}
		for(var i = 0; i < values.length; i++){
			if(values[i] != null){
				return values[i];
			}
		}
		return null;
    }
	
	// ### Constructeur de la classe *Scene*
    // Le constructeur de cette classe définit la scene.
	constructor(){	
		this.name = "scene";
		this.background = SceneObject.create("Background", "background", this);
		this.player1 = SceneObject.create("Player", "player1", this);
		this.player2 = SceneObject.create("Player", "player2", this);		
		this.ball = SceneObject.create("Ball", "ball",this);
		this.referee = SceneObject.create("Referee", "referee", this);
	}
	
	// ### Méthode *setup*
    // La méthode *setup** met en place la scene
	setup(descr){
		this.background.setup(descr["background"]);
		this.player1.setup(descr["player1"]);
		this.player2.setup(descr["player2"]);
		this.ball.setup(descr["ball"]);
		this.referee.setup(descr["referee"]);
	}
	
  }

  return Scene;
});
