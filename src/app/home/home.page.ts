import { Component, Sanitizer, SecurityContext } from '@angular/core'
import { SocialSharing } from "@ionic-native/social-sharing/ngx"

import * as moment from "moment"
import { Event } from "./../modals/event"
import { PickerController } from '@ionic/angular'
import { PickerOptions } from '@ionic/core'
declare var historyData: any

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pickedDate
  selected = 'events'
  eventsList: Array<Event> = []
  data: any
  selectedEvent: Event = {
    text: "The Arakan Rohingya Salvation Army launches its first attack on Myanmar security forces along the Bangladesh-Myanmar border.",
    type: "events",
    html: "The <a href='https://wikipedia.org/wiki/Arakan_Rohingya_Salvation_Army' title='Arakan Rohingya Salvation Army'>Arakan Rohingya Salvation Army</a> launches its <a href='https://wikipedia.org/wiki/Northern_Rakhine_State_clashes#2016' title='Northern Rakhine State clashes'>first attack</a> on <a href='https://wikipedia.org/wiki/Myanmar' title='Myanmar'>Myanmar</a> security forces along the <a href='https://wikipedia.org/wiki/Bangladesh%E2%80%93Myanmar_border' title='Bangladesh-Myanmar border'>Bangladesh-Myanmar border</a>.",
    year: 2016,
    links: [
      {
        title: '2016',
        link: '"https://wikipedia.org/wiki/2016"'
      },
      {
        title: '2016',
        link: '"https://wikipedia.org/wiki/2016"'
      }
    ],
    tags: ['2016', "arakan rohingya salvation army", "myanmar", "bangladesh-myanmar border", "oct 09", "northern rakhine state clashes"]
  }
  // bornList: Array<Birth> = []
  // diedList: Array<Dead>

  constructor(
    public socialShare: SocialSharing,
    public sanitaizer: Sanitizer,
    public pickerController: PickerController
  ) {
  }

  ngOnInit() {
    this.getData()
    this.pickedDate = moment().format()    
    // this.eventsList = [
    //   { text: 'Something happened ago on this day.', year: 1024, type: 'event' } as Event,
    //   { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque voluptate dolore laborum sit delectus, suscipit tenetur odio aut repellat placeat!", year: 512, type: 'event' } as Event
    // ]
  }

  picked() {
    console.log(this.pickedDate, moment(this.pickedDate))
    this.data = null
    this.eventsList = []
    this.getData()
  }

  getData() {
    historyData.load({
      month: moment(this.pickedDate).month() + 1,
      day: moment(this.pickedDate).date(),
      callback: async function (data) {
        console.log(data)
        console.log(historyData)
        this.data = data

        this.extractData()
      }.bind(this)
    })
  }

  extractData(length = 1) {
    let key: string
    switch (this.selected) {
      case 'events':
        key = 'Events'
        break;
      case 'born':
        key = 'Births'
        break;
      case 'died':
        key = 'Deaths'
        break;
      default:
        break;
    }
    this.eventsList = []

    for (let event of this.data[key]) {
      let splitter = ' – '
      let newEvent = {
        year: event.year.split(splitter)[0],
        text: event.year.split(splitter)[1],
        type: this.selected.toLocaleLowerCase(),
        // html: this.sanitaizer.sanitize(SecurityContext.HTML, event.html.split(splitter)[1]),        
        html: this.sanitaizer.sanitize(SecurityContext.HTML, event.no_year_html),
        links: event.links,
        tags: []
      } as Event
      for (let link of event.links) {
        newEvent.tags.push(link.title.toLocaleLowerCase())
      }
      // newEvent.tags.push(this.picked.toLocaleLowerCase())
      this.eventsList.push(newEvent)
      this.eventsList.sort((a, b) => {
        return b.year - a.year
      })
    }
  }

  subHeadingClicked(event) {
    this.eventsList = []
    document.getElementById(this.selected).classList.remove('selected')
    this.selected = event.srcElement.id
    this.extractData()
    event.srcElement.classList.add('selected')
  }

  eventClicked(event: Event) {
    console.log(event)
    this.selectedEvent = event
  }

  shareEvent(event: Event) {
    var message;
    if (event.type == 'events') {
      message = `Today (in ${event.year}), ${event.text}`
    } else if (event.type == 'born') {
      message = `Today (in ${event.year}), ${event.links[1].title} was born.`
    } else if (event.type == 'died') {
      message = `Today (in ${event.year}), ${event.links[1].title} was died.`
    }
    console.log(message)
    this.socialShare.share(message, '', event.links[1].link)
  }

  async selectDate() {
    let picker = await this.pickerController.create({
      animated: true,
      backdropDismiss: true,
      columns: [
        {
          name: ''
        }
      ]
    } as PickerOptions)
  }
}
