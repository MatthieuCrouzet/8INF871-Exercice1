define([
  'components',
], (
  ComponentFactory
) => {
  'use strict';

  // # Classe *SceneObject*
  // La classe *SceneObject* représente un objet de la scène qui
  // peut contenir des enfants et des composants.
  class SceneObject {
	  
	
	static create(name, components, children, owner){
      const sceneObject = new SceneObject(name,owner);
        if(components){
		  var keys = Object.keys(components);
          for(var i=0; i < keys.length; i++){
            sceneObject.addComponent(keys[i]);
          };
        }
        if (children){
		  var keys = Object.keys(children);
		  for(var i=0; i < keys.length; i++){
            const object = SceneObject.create(keys[i], children[keys[i]].components, children[keys[i]].children, this);
            sceneObject.addChild(keys[i], object);
          };
        }
        return sceneObject;
  }  
	  
    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    addComponent(type) {
	  this.components[type] =  ComponentFactory.create(type, this);
    }
	
	// ### Constructeur de la classe *SceneObject*
    // Le constructeur de cette classe prend en paramètre le name du SceneObject et l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
	constructor(name, owner){
		this.name = name;
		this.owner = owner;
		this.components = [];
		this.children = [];
	}

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
	  return this.components[type];
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      this.children[objectName] = child;
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {      
	  return this.children[objectName];
    }

    // ## Fonction *fingObjectInScene*
    // Cette fonction retourne un objet de la scène portant le
    // nom spécifié. Cet objet n'est pas nécessairement en lien
    // avec l'objet courant. Voir la méthode `findObject` de la
    // classe *Scene*.
    findObjectInScene(objectName) {
	  var current = this;
	  while(current.name != "scene"){
		  current = current.owner;
	  }
	  return current.findObject(objectName);
    }
	

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
     for (var keys in this.components){
        this.components[keys].display(dT);
      }
	 for (var keys in this.children){
        this.children[keys].display(dT);
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
     for (var keys in this.components){
		//console.log(this.components[keys]);
        this.components[keys].update(dT);
      }
	 for (var keys in this.children){
        this.children[keys].update(dT);
      }
	   
    }
	
	setup(descr, promises) {
		for(var i in this.children){
			this.children[i].setup(descr.children[this.children[i].name], promises);
		};	
		for(var i in this.components){
			this.components[i].setup(descr.components[this.components[i].type], promises);
		};	
	}
	
  }

  return SceneObject;
});
