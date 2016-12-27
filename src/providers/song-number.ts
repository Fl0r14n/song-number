import {Injectable} from '@angular/core';

@Injectable()
export class SongNumberService {

  digits: any[] = [{
    pos: 0,
    value: 0
  }, {
    pos: 1,
    value: 0
  }, {
    post: 2,
    value: 0
  }];
  notes: string = '';
  book: any;
  books: any[] = [
    {
      title: 'Caietele negre',
      description: 'Caietele vechi',
      thumb: 'assets/thumb/caiete_negre.jpg',
      img: 'assets/img/'
    },
    {
      title: 'Vrednic este Mielul vol.1',
      description: 'Cartile portocalii',
      thumb: 'assets/thumb/vrednic_este_mielul_1.jpg',
      img: 'assets/img/',
    },
    {
      title: 'Vrednic este Mielul vol.2',
      description: 'Cantari cor de pasti si craciun',
      thumb: 'assets/thumb/vrednic_este_mielul_2.jpg',
      img: 'assets/img/',
    },
    {
      title: 'Caietele albastre',
      description: 'Caietele albastre',
      thumb: 'assets/thumb/caiete_albastre.jpg',
      img: 'assets/img/',
    },
    {
      title: 'Un ospat nesfarsit',
      description: 'Cartea rosie Jubilate',
      thumb: 'assets/thumb/un_ospat_nesfarsit.jpg',
      img: 'assets/img/',
    },
    {
      title: 'Cantarile Evangheliei',
      description: 'Cartile rosii',
      thumb: 'assets/thumb/cantarile_evangheliei_rosii.jpg',
      img: 'assets/img/',
    }
  ];
  info: string = '';

  showNumber() {
    console.log('Show number');
  }

  showInfo() {
    console.log('Show Info');
  }

  changeDigitLength(size: number) {
    this.digits = [];
    for (let i = 0; i < size; i++) {
      this.digits.push({
        pos: i,
        value: 0
      })
    }
  }
}
