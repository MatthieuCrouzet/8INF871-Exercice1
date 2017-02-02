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
		var promise = new Promise(
			function(resolve, reject) {  				
			  const scene = new Scene();
			  if(Object.keys(description).length > 0){
				scene.setup(description);
			  }
			  resolve(scene);
			});
		  return promise;
    }

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display(dT) {
		this.children.forEach(function(key){
			if(key instanceof SceneObject)
				key.display(dT);
		});
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update(dT) {
		this.children.forEach(function(key){
			if(key instanceof SceneObject)
				key.update(dT);
		});
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName) {
		var values = [];
		this.children.forEach(function(key){
			if(key instanceof SceneObject)
				values.push(key.findObjectInObject(objectName));
		});
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
		this.children = [];
		var background = SceneObject.create("Background", "background", this);
		var player1 = SceneObject.create("Player", "player1", this);
		var player2 = SceneObject.create("Player", "player2", this);		
		var ball = SceneObject.create("Ball", "ball",this);
		var referee = SceneObject.create("Referee", "referee", this);
		this.children.push(background,player1, player2, ball, referee);
	}
	
	// ### Méthode *setup*
    // La méthode *setup** met en place la scene
	setup(descr){
		this.children[0].setup(descr["background"]);
		this.children[1].setup(descr["player1"]);
		this.children[2].setup(descr["player2"]);
		this.children[3].setup(descr["ball"]);
		this.children[4].setup(descr["referee"]);
	}
	
  }

  return Scene;
});
