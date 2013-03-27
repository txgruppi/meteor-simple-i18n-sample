Meteor.startup(function(){
  // Init i18n package on server and client
  Meteor.I18n();
});

if (Meteor.isClient) {
  Handlebars.registerHelper('user_name', function(){
    var user_name = Session.get('user_name');
    return user_name ? user_name : '';
  });

  Template.name_form.placeholder = function(){
    return Meteor.I18n().t("What is your name?");
  };

  Template.name_form.rendered = function(){
    var user_name = Session.get('user_name');
    this.find('input').value = (user_name ? user_name : '');
  };

  Template.name_form.events({
    'keyup input': function(e){
      var input = e.target;
      var value = _.str.trim(input.value);

      if (value.length)
        Session.set('user_name', value);
      else
        Session.set('user_name', null);
    }
  });

  Template.lang.events({
    'click a': function(e){
      e.preventDefault();
      var lang = e.currentTarget.className;
      Meteor.I18n().lang(lang);
    }
  });
}

if (Meteor.isServer) {
  var checkTranslations = function(){
    var translations = [
      {lang: 'pt-br', base_str: 'Hello', new_str: 'Olá'},
      {lang: 'de', base_str: 'Hello', new_str: 'Hallo'},
      {lang: 'es', base_str: 'Hello', new_str: 'Hola'},
      {lang: 'it', base_str: 'Hello', new_str: 'Ciao'},
      {lang: 'pt-br', base_str: 'Hello %s', new_str: 'Olá %s'},
      {lang: 'de', base_str: 'Hello %s', new_str: 'Hallo %s'},
      {lang: 'es', base_str: 'Hello %s', new_str: 'Hola %s'},
      {lang: 'it', base_str: 'Hello %s', new_str: 'Ciao %s'},
      {lang: 'pt-br', base_str: 'What is your name?', new_str: 'Qual o seu nome?'},
      {lang: 'de', base_str: 'What is your name?', new_str: 'Wie ist Ihr Name?'},
      {lang: 'es', base_str: 'What is your name?', new_str: '¿Cuál es su nombre?'},
      {lang: 'it', base_str: 'What is your name?', new_str: 'Qual è il tuo nome?'}
    ];
    var i18n = Meteor.I18n();

    for (var i in translations) {
      if (!i18n.collection.findOne({lang: translations[i].lang, base_str: translations[i].base_str})) {
        i18n.insert(translations[i].lang, translations[i].base_str, translations[i].new_str);
      }
    }
  };

  Meteor.startup(function(){
    // Check for translations each 1 hour
    // Fix for missing records on http://simple-i18n-sample.meteor.com/
    setInterval(checkTranslations, 3600000);
    checkTranslations();
  });
}
