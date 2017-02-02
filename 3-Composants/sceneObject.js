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
	  
	static create(type, name, descr, owner) {
		let sceneObjectCreators = {
			Background: BackgroundObject,
			Ball: BallObject,
			Player: PlayerObject,
			Referee: RefereeObject,
			Score: ScoreObject
		};  
      const obj = new sceneObjectCreators[type](name, descr,owner);
      obj.__type = type;
      return obj;
    }
	  

	  
	  
    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
	  this.components.push(newComponent);
	  return newComponent;
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
	  var comp = null;
	  this.components.forEach((key,value) => {
		  if(comp){
			  return;
		  }
		  if(this.components[value].__type == type){
			  comp = this.components[value];
		  }
	  });
	  console.log(comp);
	  return comp;
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
	  child.name = objectName;
      this.children.push(child);
	  return child;
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
	
	// ## Fonction *fingObjectInObject*
    // Cette fonction retourne un objet fils d'un objet portant le
    // nom spécifié.
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
	  return this;
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
	 return this;
    }
  }

  // ## Classe *PlayerObject*
  // Cette classe représente un joueur selon une position,
  // une texture, un joystick et un collider
  class PlayerObject extends SceneObject{
	// ### Constructeur de la classe *PlayerObject*
    // Le constructeur de cette classe prend en paramètre le name du PlayerObject et l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
	  constructor(name, owner){		  
		  super(name, owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");		  
		  this.addComponent("Joystick");
		  this.addComponent("Collider");
		  
		  var score = new ScoreObject("score", this);
		  this.addChild("score", score);
	  }
	  
	// ### Méthode *setup*
    // Initilise la position, la texture, le joystick, et le score du player.
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
  
  // ## Classe *BackgroundObject*
  // Cette classe représente un background selon une position
  // et une texture
  class BackgroundObject extends SceneObject{
	// ### Constructeur de la classe *PlayerObject*
    // Le constructeur de cette classe prend en paramètre le name du PlayerObject, l'object
	// de description et l'objet propriétaire du composant, et l'assigne au membre `owner`.
	  constructor(name,descr, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");			  
	  }
	  
	// ### Méthode *setup*
    // Initilise la position et la texture.
	  setup(descr){
		  var pos = this.getComponent("Position");
		  pos.setup(descr["components"]["Position"]);
		  
		  var texture = this.getComponent("Texture");
		  texture.setup(descr["components"]["Texture"]);
	  }
  }
  
  // ## Classe *RefereeObject*
  // Cette classe représente un arbitre selon un arbitre
  class RefereeObject extends SceneObject{
	 // ### Constructeur de la classe *RefereeObject*
    // Le constructeur de cette classe prend en paramètre le name du RefereeObject et l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
	  constructor(name, owner){
		super(name, owner);
		
		this.addComponent("Referee");
	  }
	  
	 // ### Méthode *setup*
    // Initilise l'arbitre.
	  setup(descr){		
		var referee = this.getComponent("Referee");
		referee.setup(descr["components"]["Referee"]);
	  }
  }
  
  // ## Classe *BallObject*
  // Cette classe représente une ball selon une position,
  // une texture, une motion et un collider
  class BallObject extends SceneObject{
	// ### Constructeur de la classe *BallObject*
    // Le constructeur de cette classe prend en paramètre le name du BallObject et l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
	  constructor(name, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");		  
		  this.addComponent("Texture");
		  this.addComponent("Motion");
		  this.addComponent("Collider");	
	  }
	  
	// ### Méthode *setup*
    // Initilise la position, la texture, la motion, et le collider de la ball.
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
  
  // ## Classe *ScoreObject*
  // Cette classe représente un score selon une position,
  // une texture, une textureAtlas et un score
  class ScoreObject extends SceneObject{
	// ### Constructeur de la classe *ScoreObject*
    // Le constructeur de cette classe prend en paramètre le name du ScoreObject et l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
	  constructor(name, owner){
		  super(name,owner);
		  
		  this.addComponent("Position");
		  this.addComponent("Texture");	  
		  this.addComponent("TextureAtlas");		  
		  this.addComponent("Score");
	  }
	  
	// ### Méthode *setup*
    // Initilise la position, la texture, la textureAtlas, et le score du score.
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


  return SceneObject;
});
