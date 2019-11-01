import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Setting } from '../../tiles/models/setting.model';
import { TileService } from './tile.service';
import { AlertController, Events } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Tile } from '../models/tile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'tile-setting',
  templateUrl: 'tile.html'
})
export class TilePage implements OnInit {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;
  selectedTile: string;
  hasChanged: boolean;

  constructor(
    private tileService: TileService,
    private userService: UserService,
    private router: Router,
    private events: Events,
    private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.userService.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        this.getTiles();

      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  getTiles(): void {
    // get all tiles.
    this.tileService.getTiles()
      .subscribe((tiles: Array<Tile>) => {
        this.tiles = tiles;
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  back(): void {
    this.router.navigateByUrl('/main');
  }

  saveItem(tile: Tile): void {
    this.hasChanged = true;
    this.tileService.saveTile(tile)
      .subscribe(async (saved: boolean) => {
        if (saved) {
          const alert = await this.alertCtrl.create({
            header: 'Info!',
            message: 'Successfully saved!',
            backdropDismiss: false,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.events.publish('data:changed');
                  this.getTiles();
                }
              }
            ]
          });
          await alert.present();
        }
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  /**
   * Error Handler
   * @param {HttpErrorResponse} error
   */
  private async errorHandling(error: HttpErrorResponse): Promise<void> {
    (error.status === 0) ? this.error = 'No Connection to the Backend!' : this.error = error.message;

    const alert = await this.alertCtrl.create({
      header: 'Error!',
      message: this.error,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: async () => {
            await alert.present();
          }
        }
      ]
    });
    await alert.present();
  }
}
