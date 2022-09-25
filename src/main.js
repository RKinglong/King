import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Swipe, SwipeItem, Lazyload, Badge, Sidebar, SidebarItem, 
    Collapse, CollapseItem, Tab, Tabs, Card, Image as VanImage,Tag,Button,
    Form, Field, CellGroup,SubmitBar, SwipeCell, Stepper,Checkbox, CheckboxGroup,
    Icon, AddressEdit, AddressList, Area, Popup, Grid, GridItem, List, PullRefresh
} from 'vant';

createApp(App)
.use(Swipe).use(SwipeItem).use(Sidebar).use(SidebarItem).use(Badge)
.use(Collapse).use(CollapseItem).use(Tab).use(Tabs).use(Card).use(VanImage)
.use(Tag).use(Button).use(Form).use(Field).use(CellGroup).use(SubmitBar)
.use(SwipeCell).use(Stepper).use(Checkbox).use(CheckboxGroup).use(Icon)
.use(AddressEdit).use(AddressList).use(Area).use(Popup).use(Grid).use(GridItem)
.use(List).use(PullRefresh)
.use(Lazyload,{loading:require('./assets/images/loading.gif')})
.use(store).use(router).mount('#app')
