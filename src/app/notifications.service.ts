import { Injectable } from '@angular/core'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    public localNotifications: LocalNotifications
  ) {
      if (!this.localNotifications.hasPermission()) {
        this.localNotifications.requestPermission()
      }
    }

  public schedule() {
    if (this.localNotifications.isScheduled(124)) {
      console.log('already scheduled')
    } else { 
      this.localNotifications.schedule({
        id: 124,
        title: 'New Events Found',
        text: 'We found some events for you. Check them out!',
        trigger: { at: moment().add(1, 'd').set('h', 6).toDate() },
        led: 'FF0000',
        sound: null
      })
    }
  }
}
