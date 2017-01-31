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
		child.name = objectName;
      this.children.push(child);
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {      
	  var child = null;
      this.children.forEach((key, value) => {
        if (child) {
          return;
        }
		if(this.children[value].name == objectName)
			child = this.children[value];
      });
      return child;
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
	
	findObjectInObject(objectName){
	  if(this.name == objectName)
			return this;
      if (this.getChild(objectName)) {
        return this.getChild(objectName);
      }
      var object = null;
      this.children.forEach((key, value) => {
        if (object) {
          return;
        }
		if(this.children[value])
			object = this.children[value].findObjectInObject(objectName);
      });
      return object;
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      this.children.forEach((key, value) => {
        this.children[value].display(dT);
      });
	  this.components.forEach((key, value) => {
        this.components[value].display(dT);
      });
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
     this.children.forEach((key, value) => {
        this.children[value].update(dT);
      });
	  this.components.forEach((key, value) => {
        this.components[value].update(dT);
      });
    }
  }

  class PlayerObject extends SceneObject{
	  constructor(name, owner){		  
		  super(name, owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");		  
		  this.addComponent("Joystick");
		  this.addComponent("Collider");
		  
		  var score = new ScoreObject("score", this);
		  this.addChild("score", score);
	  }
	  
	  setup(descr){
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
		  
		  var joystick = this.getComponent("Joystick");
		  joystick.setup(descr["components"]["Joystick"]);
		  
		  var collider = this.getComponent("Collider");
		  collider.setup(descr["components"]["Collider"]); 
		  
		  var score = this.getChild("score");
		  score.setup(descr["children"]["score"]);
	  }
  }
  
  class BackgroundObject extends SceneObject{
	  constructor(name,descr, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");			  
	  }
	  
	  setup(descr){
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
	  }
  }
  
  class RefereeObject extends SceneObject{
	  constructor(name, owner){
		super(name, owner);
		
		this.addComponent("Referee");
	  }
	  
	  setup(descr){		
		var referee = this.getComponent("Referee");
		referee.setup(descr["components"]["Referee"]);
	  }
  }
  
  class BallObject extends SceneObject{
	  constructor(name, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");		  
		  this.addComponent("Texture");
		  this.addComponent("Motion");
		  this.addComponent("Collider");	
	  }
	  
	  setup(descr){
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
		  
		  var motion = this.getComponent("Motion");
		  motion.setup(descr["components"]["Motion"]);	
		  
		  var collider = this.getComponent("Collider");
		  collider.setup(descr["components"]["Collider"]);	  
	  }
  }
  
  class ScoreObject extends SceneObject{
	  constructor(name, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");	  
		  this.addComponent("TextureAtlas");		  
		  this.addComponent("Score");
	  }
	  
	  setup(descr){		  
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
		  
		  var texture = this.getComponent("TextureAtlas");
		  texture.setup(descr["components"]["TextureAtlas"]);
		  
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
