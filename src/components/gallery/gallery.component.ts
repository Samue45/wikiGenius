import { GeniusService } from 'src/app/services/genius.service';
import { Component, EventEmitter, Input, OnInit , Output} from '@angular/core';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MiniCardComponent } from '../mini-card/mini-card.component';
import { GeniusesCategory } from 'src/app/models/Geniuses-category';
import { Category } from 'src/app/models/category';
import { Genius } from 'src/app/models/Genius';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports : [NgFor, CommonModule , IonHeader, IonToolbar, IonTitle,  IonGrid, IonRow, IonCol , MiniCardComponent]
})
export class GalleryComponent  implements OnInit {

  
  constructor(private geniusService : GeniusService) {}

  @Output() geniusSelected =  new EventEmitter<Genius>();

  private Geniuses: GeniusesCategory = {
    [Category.Math] : [],
    [Category.Physic] : [],
    [Category.Informatic] : [],
    [Category.Philosophers]: [],
    [Category.Biologists]: [],
    [Category.Biochemicals]: [],
    [Category.Deaf]: []

  } 
  // Lista con los genios filtrados
  public filteredGeniuses : any [] = [];

  // Variable con el valor de la categoría
  public selectedCategory : string = 'todos';

  ngOnInit() {
    // Con este método obtenemos todas las URL asociadas a cada foto de cada genio y sus nombres
    this.loadAllGeniuses();

  }

  loadAllGeniuses() : void {
    this.geniusService.getFilteredGeniuses().subscribe({
      next: (data) => {
        this.Geniuses = data;
        this.searchGeniousByNameAndCategory();
        console.log('Datos de los genios cargados con éxito');
      },
      error: (err) => {
        console.log('Hubo un error a cargar los genios del servicio de genios');
        alert('Hubo un error a cargar los genios del servicio de genios');
      },
      complete: () => {
        console.log('Carga de genios completada.');
      }
    });
  }


  searchGeniousByNameAndCategory(nameSearch: string = '', category: string = 'todos') {
    this.selectedCategory = category; // 🔄 Actualizamos la categoría seleccionada
    this.applyFilter(nameSearch);
  }

  applyFilter(nameSearch : string = ''){
    const lowerSearch = nameSearch.toLowerCase();

    if(this.selectedCategory === 'todos'){
      
      // 1º Creamos un array general con todos los genios
      const allGeniuses = [
      ...this.Geniuses[Category.Math],
      ...this.Geniuses[Category.Physic],
      ...this.Geniuses[Category.Informatic],
      ...this.Geniuses[Category.Philosophers],
      ...this.Geniuses[Category.Biologists],
      ...this.Geniuses[Category.Biochemicals],
      ...this.Geniuses[Category.Deaf],
      
      ];

      //2º Eliminamos duplicados
      const seen = new Set<String>();
      this.filteredGeniuses = allGeniuses.filter(genius => {
        const key = genius.name;

        if(seen.has(key)) return false;
        seen.add(key);
        return true;
      })

      // 3º Filtramos por el nombre
      this.filteredGeniuses = this.filteredGeniuses.filter(genius => genius.name.toLowerCase().startsWith(lowerSearch));
      
    }else {
      this.filteredGeniuses = this.Geniuses[this.selectedCategory as Category].filter(genio =>
        genio.name.toLowerCase().startsWith(lowerSearch)
      );
    }
  }

  onSelectGenius(genius: Genius) {
    this.geniusSelected.emit(genius);
  }


}