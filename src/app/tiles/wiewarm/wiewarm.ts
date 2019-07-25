import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';

import { Setting } from '../../../shared/setting.model';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-wiewarm',
  templateUrl: 'wiewarm.html'
})

/**
 * Represents a Wiewarm.ch tile.
 */
export class Wiewarm extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  data: Object;

  /**
   * Create the Wiewarm.ch tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      if (data)
        this.data = data.wiewarm;
    });
  }
}
