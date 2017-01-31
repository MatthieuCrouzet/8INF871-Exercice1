define([
  'sceneObject',
], (
  SceneObjectFactory
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
      const scene = new Scene(description);
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
		var promises = [];
		if(this.background){
			const bg = this.background.findObjectInObject(objectName);
			promises.push(bg);
		}
		if(this.ball){
			const ball = this.ball.findObjectInObject(objectName);
			promises.push(ball);
		}
		if(this.player1){
			const p1 = this.player1.findObjectInObject(objectName);
			promises.push(p1);
		}
		if(this.player2){
			const p2 = this.player2.findObjectInObject(objectName);
			promises.push(p2);
		}
		if(this.referee){
			const ref = this.referee.findObjectInObject(objectName);
			promises.push(ref);
		}
		Promise.all(promises).then ((values) => {
			for(var i = 0; i < values.length; i++){
				if(values[i] != null){
					return values[i];
				}
			}
			return null;
		});
    }
	
	constructor(descr){	
		this.name = "scene";
		this.background = SceneObjectFactory.create("Background", "background", descr["background"], this);
		this.player1 = SceneObjectFactory.create("Player", "player1", descr["player1"], this);
		this.player2 = SceneObjectFactory.create("Player", "player2", descr["player2"], this);		
		this.ball = SceneObjectFactory.create("Ball", "ball", descr["ball"],this);
		this.referee = SceneObjectFactory.create("Referee", "referee", descr["referee"], this);
	}
	
	
	
  }

  return Scene;
});
