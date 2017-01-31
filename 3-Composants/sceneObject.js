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
    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
	  this.components.push(newComponent);
    }
	
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
	  for(var i = 0; i < this.components.length; i++) {
		  var comp = this.components[i];
		  if(comp.__type == type){
			  return comp;
		  }
	  }
	  return null;
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      this.children.push(objectName => child);
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
	  current.findObject(objectName);
    }
	
	findObjectInObject(objectName){
      if (this.children[objectName]) {
        return this.getChild(objectName);
      }
      var object = null;
      this.children.forEach((key, value) => {
        if (object) {
          return;
        }
		if(this.children[key])
			object = this.children[key].findObjectInObject(objectName);
      });
      return object;
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      this.children.forEach((key, value) => {
        this.children[key].display(dT);
      });
	  this.components.forEach((key, value) => {
        this.components[key].display(dT);
      });
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
     this.children.forEach((key, value) => {
        this.children[key].update(dT);
      });
	  this.components.forEach((key, value) => {
        this.components[key].update(dT);
      });
    }
  }

  class PlayerObject extends SceneObject{
	  constructor(name,descr, owner){		  
		  super(name, owner);
		  this.addComponent("Position");
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  this.addComponent("Texture");
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);		  
		  this.addComponent("Joystick");
		  var joystick = this.getComponent("Joystick");
		  joystick.setup(descr["components"]["Joystick"]);
		  this.addComponent("Collider");
		  var collider = this.getComponent("Collider");
		  collider.setup(descr["components"]["Collider"]);
		  var score = new ScoreObject("score", descr["children"]["score"], this);
		  this.addChild("score", score);
	  }
  }
  
  class BackgroundObject extends SceneObject{
	  constructor(name,descr, owner){
		  super(name,owner);
		  this.addComponent("Position");
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  this.addComponent("Texture");
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);			  
	  }
  }
  
  class RefereeObject extends SceneObject{
	  constructor(name,descr, owner){
		super(name, owner);
		this.addComponent("Referee");
		var referee = this.getComponent("Referee");
		referee.setup(descr["components"]["Referee"]);
	  }
  }
  
  class BallObject extends SceneObject{
	  constructor(name,descr, owner){
		  super(name,owner);
		  this.addComponent("Position");
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  this.addComponent("Texture");
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
		  this.addComponent("Motion");
		  var motion = this.getComponent("Motion");
		  motion.setup(descr["components"]["Motion"]);
		  this.addComponent("Collider");
		  var collider = this.getComponent("Collider");
		  collider.setup(descr["components"]["Collider"]);	  
	  }
  }
  
  class ScoreObject extends SceneObject{
	  constructor(name,descr, owner){
		  super(name,owner);
		  this.addComponent("Position");
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  this.addComponent("Texture");
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);		  
		  this.addComponent("TextureAtlas");
		  var texture = this.getComponent("TextureAtlas");
		  texture.setup(descr["components"]["TextureAtlas"]);		  
		  this.addComponent("Score");
		  var texture = this.getComponent("Score");
		  texture.setup(descr["components"]["Score"]);
	  }
  }
  
  class SceneObjectFactory {
    static create(type, name, descr, owner) {
      const comp = new SceneObjectFactory.sceneObjectCreators[type](name, descr,owner);
      comp.__type = type;
      return comp;
    }
  }
  
  SceneObjectFactory.sceneObjectCreators = {
    Background: BackgroundObject,
	Ball: BallObject,
	Player: PlayerObject,
	Referee: RefereeObject,
	Score: ScoreObject
  };

  return SceneObjectFactory;
});
