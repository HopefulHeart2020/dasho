import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';

/**
 * Represents the language provider
 */
@Injectable()
export class LanguageProvider {
  currentLanguage: string;
  keys: any = {};

  /**
   * Create the language provider
   * @constructor
   * @param {Events} events Used to subscribe to the `user:language`
   * @param {TranslateService} translate The service from ng2-translate
   * @param {Storage} storage The storage from @ionic/storage
   */
  constructor(
    private events: Events,
    private translate: TranslateService,
    private storage: Storage) {

    this.events.subscribe('user:language', data => {
      this.setLanguage(data.key);
    });
  }

  /**
   * Set the inital language
   */
  initialLanguage(): void {
    const DEFAULT_LANGUAGE = 'en';
    const BROWSER_LANG = this.translate.getBrowserLang();
    const choosenLanguage = BROWSER_LANG.match(/en|de/) ? BROWSER_LANG : DEFAULT_LANGUAGE;

    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    this.translate.use(choosenLanguage);

    this.getLanguage()
      .then(value => {
        if (value.match(/en|de/) && choosenLanguage !== value)
          this.setLanguage(value);
      });
    this.setLanguage(choosenLanguage);
  }

  /**
   * Link to the getTranslation function from the language provider
   * @param {string} languageKey The language key. Defaults to the current language
   * @return {Observable} Gets an object of translations for a given language with the current loader
   */
  getTranslation(languageKey: string = this.translate.currentLang): any {
    return this.translate.getTranslation(languageKey);
  }

  /**
   * Link to the get function from the language provider
   * @param {string} key The value of a key (or an array of keys).
   * @return {string|Object} Gets the instant translated value or Object
   */
  get(key: string | Array<string>): string | Object {
    return this.translate.get(key);
  }

  /**
   * Set the language. Runs serval functions to set the language correctly
   * @param {string} languageKey The language key
   */
  setLanguage(languageKey: string = this.translate.currentLang): void {
    moment.locale(languageKey);
    this.translate.use(languageKey);
    this.currentLanguage = languageKey;
    this.storage.set('language', languageKey);

    this.translate.getTranslation(languageKey)
      .subscribe(data => {
        this.keys = data;
      });
  }

  /**
   * Get the language key from the storage
   * @return {Promise} The Promise from the storage
   */
  getLanguage(): any {
    return this.storage.get('language');
  }

  /**
   * Get the language strings
   * @return {Object} The object with all the strings
   */
  getLanguageStrings(): any {
    return this.keys;
  }
}
