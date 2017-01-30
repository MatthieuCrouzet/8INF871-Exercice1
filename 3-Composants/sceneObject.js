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

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
	  foreach(comp in this.components){
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
      throw new Error('Not implemented');
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      throw new Error('Not implemented');
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
      throw new Error('Not implemented');
    }
  }

  class Player extends SceneObject{
	  constructor(name,descr){	
		  this.name = name;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);		  
		  var joystick = ComponentFactory.create(Joystick, this);
		  joystick.setup(descr["components"]["Joystick"]);
		  var collider = ComponentFactory.create(Collider, this);
		  collider.setup(descr["components"]["Collider"]);
		  this.addComponent(pos);
		  this.addComponent(texture);
		  this.addComponent(joystick);
		  this.addComponent(collider);
		  var score = new Score(descr["children"]["score"]);
		  this.addChild("score", score);
	  }
  }
  
  class Background extends SceneObject{
	  constructor(name,descr){
		  this.name = name;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);
		  this.addComponent(pos);
		  this.addComponent(texture);
		  
	  };
  }
  
  class Referee extends SceneObject{
	  constructor(name,descr){
		this.name = name;
		var referee = ComponentFactory.create(Referee, this);
		referee.setup(descr["components"]["Referee"]);
		this.addComponent(referee);
	  }
  }
  
  class Ball extends SceneObject{
	  constructor(name,descr){
		  this.name = name;
		  var pos = ComponentFactory.create(Position, this);
		  pos.setup(descr["components"]["Position"]);
		  var texture = ComponentFactory.create(Texture, this);
		  texture.setup(descr["components"]["Texture"]);		  
		  var motion = ComponentFactory.create(Motion, this);
		  motion.setup(descr["components"]["Motion"]);
		  var collider = ComponentFactory.create(Collider, this);
		  collider.setup(descr["components"]["Collider"]);
		  this.addComponent(pos);
		  this.addComponent(texture);
		  this.addComponent(motion);
		  this.addComponent(collider);
	  }
  }
  
  class Score extends SceneObject{
	  constructor(name,descr){
		  this.name = name;
		  var scorePos = ComponentFactory.create(Position, this);
		  scorePos.setup(descr["components"]["Position"]);
		  var scoreText = ComponentFactory.create(Texture, this);
		  scoreText.setup(descr["components"]["Texture"]);
		  var scoreTextAtlas = ComponentFactory.create(TextureAtlas, this);
		  scoreTextAtlas.setup(descr["components"]["TextureAtlas"]);
		  var scoreScore = ComponentFactory.create(Score, this);
		  scoreScore.setup(descr["components"]["Score"]);		  
		  this.addComponent(scorePos);
		  this.addComponent(scoreText);
		  this.addComponent(scoreTextAtlas);
		  this.addComponent(scoreScore);
	  }
  }
  
  
  return sceneObject;
});
