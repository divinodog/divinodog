import { has } from 'ramda'
import React from 'react'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { priceToString } from '../../../utils/dataHelper'
import ModelStandardFieldInfo from '../../verse/ModelStandardFieldInfo'

interface Props {
   readonly item: ToppingModel | SauceModel | MenuItemOptionModel
   readonly associatedMenuItems: string
   readonly hasCanBeExtra?: boolean
}

const AdminGeneralProductsView: React.FC<Props> = ({ item, associatedMenuItems, hasCanBeExtra }) => {
  return (
      <div className='text-white'>
         <h2 className='text-xl text-green-500 mb-6'>
            Detalhes
         </h2>
         
         <ModelStandardFieldInfo
            label='Preço'
            info={item.price ? priceToString(item.price) : 'Sem preço'}
         />
         <ModelStandardFieldInfo
            label='Em estoque'
            info={item.isAvailable ? 'Sim' : 'Não'}
         />
         {hasCanBeExtra && (
            <ModelStandardFieldInfo
               label='Adicionável'
               info={(item as ToppingModel | SauceModel).canBeExtra ? 'Sim' : 'Não'}
            />
         )}
         {
            associatedMenuItems && (
               <ModelStandardFieldInfo
                  label='Usado por'
                  info={associatedMenuItems}
                  col
               />
            )
         }
      </div>
   )
}

export default AdminGeneralProductsView