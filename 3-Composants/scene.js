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
		var promises = [];
		const scene = new Scene();
		var keys = Object.keys(description);
		for(var i=0; i < keys.length; i++){
			promises.push(
				SceneObject.create(	keys[i], 
									description[keys[i]].components, 
									description[keys[i]].children, 
									scene));
		};
		return Promise.all(promises).then((sceneObjects) => {
			for(var obj in sceneObjects){
				scene.children[sceneObjects[obj].name] = sceneObjects[obj];
			}
		}).then(function(){
			var promises = [];
			for(var i in scene.children){
				scene.children[i].setup(description[scene.children[i].name], promises);
			};
			return Promise.all(promises);
		}).then(() => {
			return scene;
		});
	}

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display(dT) {
	  for (var keys in this.children){
		this.children[keys].display(dT);
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update(dT) {
	  for (var keys in this.children){
		this.children[keys].update(dT);
      }
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName, where = this.children) {
      if(where[objectName]){
        return where[objectName];
      } else {
        for (var i in where){
          var children = where[i].children;
          var objectFound = this.findObject(objectName,children);
          if(objectFound){
            return objectFound;
          }
        }
      }
    }
	
	// ### Constructeur de la classe *Scene*
    // Le constructeur de cette classe définit la scene.
	constructor(){	
		this.name = "scene";
		this.children = [];
		/*
		var background = SceneObject.create("Background", "background", this);
		var player1 = SceneObject.create("Player", "player1", this);
		var player2 = SceneObject.create("Player", "player2", this);		
		var ball = SceneObject.create("Ball", "ball",this);
		var referee = SceneObject.create("Referee", "referee", this);
		this.children.push(background,player1, player2, ball, referee);
		*/
	}
	
	// ### Méthode *setup*
    // La méthode *setup** met en place la scene
	setup(descr, promises){
		var children = this.children;
		Object.keys(descr).forEach((key) => {
			children.push(new SceneObject(key,this));
		});
		this.children = children;
		var promises = [];
		this.children.forEach(function(key, value){
			if(key instanceof SceneObject){
				key.setup(descr[key.name], promises);
			}
		});
		return Promise.all(promises);
	}
	
  }

  return Scene;
});
