import { MenuItem, Category, Review, Chef } from './types';
import qudaarDiyaarImg from './assets/images/qudaar_diyaar_ah_1784846895894.jpg';

export const CATEGORIES: Category[] = [
  { key: 'all', label: 'Dhammaan', icon: 'Utensils' },
  { key: 'appetizer', label: 'Cunto Fudud', icon: 'Soup' },
  { key: 'main', label: 'Cuntada Rasmiga ah', icon: 'ChefHat' },
  { key: 'drink', label: 'Cabitaano / Kafee', icon: 'Coffee' },
  { key: 'dessert', label: 'Macmacaan', icon: 'IceCream' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'app-1',
    name: 'Sanbuus',
    description: 'Sambuusi si xirfad leh loogu dhex daray hilib jilicsan, khudaar iyo xawaashyo caraf leh oo Baraa u gaar ah, kuna duban dahab.',
    price: 0.50,
    category: 'appetizer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt05h0Mknqj_c8gSaTWy37_ukdvwklWjmCtVl2uyuCJalk0RuxZ7ZavINjozwVLLo7fKmPxmX8Lob4bPAaiZabcCX44GcgzdI7jW48pThYUSbp2n8vtItnGPZHgHBFmwrHQ-WxuEbhA8dnmKAglVx7k3-wE9KL-GYdYGmqO4IhAUmgOgpVQz5VeJxY_Wd_-N8-YmNR_i6EoC_ZF7AHtsau4RnHVcEWepapbjbuo1ZENVpPzbJXy3uk797vVHhJ9UeTn6U',
    tags: ['Cunto Fudud', 'Hilib', 'Crispy'],
    isPopular: true,
    rating: 4.8
  },
  {
    id: 'app-2',
    name: 'Shuwaarmo',
    description: 'Bur-saliid dhaqameed jilicsan oo lagu daray malab saafi ah, loona qurxiyay sisin madow iyo xabad-sauda.',
    price: 2.00,
    category: 'appetizer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_jU1sWQn3wXtb5AvSXjg0wexksMAeP2Teus5Su06xHrv74vAX5-CVjTRmIXG2mPaHRZrpvMIz3f0QGNCQc8vcqya3R89eDh4V6dkLXhFyQqbqosze6yO-6EMTzuQuzp0hqCljHBJj-GqODAVGnO7xGFLm4IKTc59jNS9JUSaHETRY-wQJeba_crws59CB5pGZiwqwx79GQ9X4iZVeFM57EYQ0jIWUMBsOBjNn6fvAclaXq_jbzbkncwLUZSWxE8dcoJc',
    tags: ['Macaan', 'Dhaqameed'],
    rating: 4.5
  },
  {
    id: 'app-3',
    name: 'Baasto iyo Suugo',
    description: 'Khudaar cusub oo laga soo gooyay beerta maanta, lagu daray saliid saytuun oo saafi ah, jiis dabeeci ah, iyo liin dhanaan cusub.',
    price: 1.50,
    category: 'appetizer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTGhPX3csgxjV4jLMv5rbbdy5L6oxDJlZp9DqfMCcC2HTDrGL1I7Zntn5I1HtnoyL8_fZnyJNGMKJRhKKNf1QpZy0DngDzsQVDLqaPK_yaH2n1TRAQMkOFDdnmimYKR5mwEBe0gYwQ1WqwFzcaqGNYTLgrqtd5Z0SALcQFDP46Ux_tJpQFwSwaCasYUr5RO0vj32VS6y12fdDRWic5LrWxB5VKKjakAmHD_WQIYW-mKljVeOP6Q71kQ0Vh-XLkN_TJdII',
    tags: ['Caafimaad', 'Khudaar', 'Vegan'],
    rating: 4.6
  },
  {
    id: 'main-1',
    name: 'Bariis iyo Hilib Ari',
    description: 'Bariis basmati caraf udgoon leh oo lagu kariyay udugga xawaashyada Soomaaliga, laguna daray hilib ari aad u jilicsan oo afka ku dhalaalaya oo lagu dhex dubay foornada.',
    price: 9.50,
    category: 'main',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL80W7NOaUyb0tikjjYGczVnV2s9SZmzIfGctCts0KOSCBD0IL-rL4T_R2JGOxjQzhvKbAEG3979uW3TGoaDmHd6Fs6ul2c-wzO302Boig-8GIlXthh-f2ECHMDXEzxvT-T8cRBlzkEHJ9iJEDd6M9wWVRuIUFEvfix_2LXKyHGt8L4Zz_aKl5xVvtbevlkf_Gxza1g-7V0LhlWSH7T1RpFle-Vs7MvTOfc4I6etkUK8KXkhszv7-Or32UkWoCQgMFnAo',
    tags: ['Signature', 'Dhaqameed', 'Hilib Ari'],
    isFeatured: true,
    isPopular: true,
    rating: 4.9
  },
  {
    id: 'main-2',
    name: 'Sabaayad iyo Hilib',
    description: 'Baasto Talyaani ah oo lagu kariyay suugo yaanyo cusub, toon, iyo basbaas dabiici ah, laguna daray kalluun badda laga soo qabtay oo la shiilay.',
    price: 2.00,
    category: 'main',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIsKIThCyuPPtvEswxSJu5_jnRZ2K_WGW3yWc6JboiE2ep3WoTSYVGhGZaFiwJSiLhwAcGs0yJowLtNsh9cA7Jgqxfsk9NRcc1maINJSWxGymcS_PnRyFFzvlmHGOdswkpAShXNbEUQCo6reqmz6ayDcOcnRvCGZpmJhd37-hfTePl0qiFdKGlVpgFzbAw5I7yxiw8LasbVWDocH7dYHZeSpG-qfuUJIZXDjFTiUMX4mOxnaJ1Q78nJR1AWCgIAnHNFWg',
    tags: ['Pasta', 'Kalluun', 'Badda'],
    isPopular: true,
    rating: 4.7
  },
  {
    id: 'main-3',
    name: 'Sabaayad',
    description: 'Muufo dhaqameed lagu dubay foornada dhoobada, oo lala siinayo maraq hilib dhumuc leh oo khudaari ka buuxdo iyo suugo qandi ah.',
    price: 1.50,
    category: 'main',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuuQ6KVy1QAg4lNf_ZgZWcVyvC_LAZt6KSNbJwK5ooMcUb1r6C1DxNpsPPJ-G-rnUB6eFBF0u6fcSzkkH0xjEtJjwcQ3BZ9TmALwKh3N_x6fiClp_UsLzEenO1KgdY3DQHn_ZoPw3dkCZ_5eTKzsDU9VIhC544Av3eaUuEDLPhxs9uGKjXyuEyQEX2eXfPD6_RN8M4fZRZv2sslSXfIoqXXKyIA7IWlTlvbNWeLGza6N9gswDs32IY8ZGgL8ba6bXuNag',
    tags: ['Dhaqameed', 'Muufo', 'Maraq'],
    rating: 4.8
  },
  {
    id: 'main-4',
    name: 'Qudaar diyaar ah',
    description: 'Miro iyo qudaar dabiici ah oo la saaray saxan qurux badan, oo leh dhamaan miro xilliyeedka dabiiciga ah oo cusub (Moos, Kiwi, Canab, Xabxab, Rummaan, Bartaqaan iyo Cambe).',
    price: 3.50,
    category: 'main',
    imageUrl: qudaarDiyaarImg,
    tags: ['Miro Dabiici ah', 'Vegan', 'Caafimaad'],
    rating: 4.9
  },
  {
    id: 'drink-1',
    name: 'Casiirka Cambaha (Mango)',
    description: 'Casiir dabiici ah oo aad u qabow oo laga soo miiqay cambaha cusub ee dalkeena laga keeno, iyadoo aan lagu darin wax sonkor macmal ah.',
    price: 2.50,
    category: 'drink',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnm9dZgyrp0IzXmxx-uYBDzG_pREbJ2260ZC_MkTaOBshf45ju2isyFjhHljNuNa_t7wK0lOq6mcwv3tJtRNrCbUhZnykWLdKc7GmOKyQOnmvcCFL2WB9vEb1dq1bwWDypLV8p4ziwqnxWUEF4vjOAeDhkDKJPYNyQCxQyrKWdkEEKrLIebuJtd1uW7W_jMJjIVemBRxFrTYp8pDgAI9eeAjeIkB5ga6qxDuac4IglmJ8QzJ3zEJZm5r_PfxbTrfzQ6JA',
    tags: ['Qabow', 'Cusub', 'Fruit'],
    isPopular: true,
    rating: 4.7
  },
  {
    id: 'drink-2',
    name: 'Coffee Latte Art',
    description: 'Espresso Baraa oo laga sameeyay miraha qaxwada ee ugu wanaagsan, laguna daray caano jilicsan iyo farshaxan farshaxanimo leh.',
    price: 1.50,
    category: 'drink',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1hneLuebazSW3S6RMRhDWlFkTD1Baw_QkLkzO5WKkvX1aCRCCxm48vtltB7XrMeFfWvknH_6oSavBWmuUY11E5qWnPApijbYqvcUpRJ_9wbSSDCAas81g2LzHKoZSfK_XG38WcSmCfMmmp5_wxKRrBjMtM-IEJclM5MevdUa408n1xdSslKeFBMBjRGZBgnR7Zn-ZnL7l90m6q-r8xB1oFR8TMJ-RcPsSUcuHL_17gDLNZnDFwVUwZP8x1JJuBnFN8F0',
    tags: ['Kuleyl', 'Coffee', 'Latte'],
    rating: 4.8
  },
  {
    id: 'dessert-1',
    name: 'Tiramisu Special',
    description: 'Kareem Talyaani ah oo lagu dhex daray qaxwo xooggan iyo buskut jilicsan, loona qurxiyay budada kookaha ee tayada sare leh.',
    price: 1.50,
    category: 'dessert',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-IfsH3kqnWbdJp6z1lx4Z_s3CA6Yoo6TIuUTjvJykLRwYD7nLgy3rXGFtXt9Ci5EsCmrByBpXQyzg-ZPIxPmHe1foFiIHV89LHP6uPksi12Eof0fOq3UrgkBZ-wSYQgif8YC-R0xx0gDt3X06AJeg2EJpTj7gGNjr20g0sL2PPszsQHuEdkUL22sDxNmReS0rhmICB9umA6vR6uJ3ODdZRwHQTNIIPbPLrAbGeIm4YaKS-rBvIxJoNgcYxNazwfkuWQ',
    tags: ['Premium', 'Chocolate', 'Macaan'],
    isFeatured: true,
    rating: 4.9
  },
  {
    id: 'dessert-2',
    name: 'Macmacaanka Baraa (Ice Cream)',
    description: 'Iskiriin qabow oo guri-guri ah oo leh dhadhanka vanila iyo shukulaato, laguna shubay kareem macaan iyo lowsk la dubay.',
    price: 1.00,
    category: 'dessert',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoPed7BS6WR25zbgCAMHgjJ9kiu9szb3BvWv_GiWPPZXEb1vVKHzLFNlaOzj-MPmbYKrlqwO8Bp2FSuMbzItXtkstyyXoB-i9AL3OQ_59zvKsOwcIt2p0s7TmBTvzFie7JXVBWdUta_dLlm-GX4Ky1dzdbHuGrGDBOBYTzhN-pIg5BuOqQQDteqUB6ITKS_L-qpFOI5IRViGL4pTKZI2OGDgBoT9qrf3s28yBM8pa5nl4HOGp0LZCuq99JbZeVWieqZMg',
    tags: ['Jalaato', 'Shukulaato', 'Qabow'],
    rating: 4.7
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'AbdiRahman Cali',
    rating: 5,
    comment: 'Bariiska iyo hilibka ariga waa mid aan la ilaawi karin! Jawi aad u qurux badan iyo adeeg hufan.',
    date: 'Maanta'
  },
  {
    id: 'rev-2',
    name: 'Hana Maxamed',
    rating: 5,
    comment: 'Casiirka cambaha waa dabiici dhab ah oo aad u qabow. Waxaan kaloo jecladay Coffee Latte-ka quruxda badan.',
    date: 'Shalay'
  },
  {
    id: 'rev-3',
    name: 'Yaxye Cumar',
    rating: 4,
    comment: 'Maqaayad heer sare ah oo ku taal wadada wadnaha ee Muqdisho. Ballansashada online-ka ah waa mid aad u fudud.',
    date: '3 maalmood ka hor'
  }
];

export const CHEFS: Chef[] = [
  {
    id: 'chef-1',
    name: 'Chef Ahmed Nuur',
    title: 'Madaxa Cunnada (Executive Chef)',
    bio: 'Iyadoo in ka badan 15 sano oo waayo-aragnimo ah uu u leeyahay jikooyinka caalamiga ah ee Yurub iyo Carabaha, Chef Ahmed wuxuu halkan u joogaa inuu saxan kasta ka dhigo farshaxan u gaar ah.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4xzSbdtGfsnGQcRC_WK1JjbkDRefOZGPkuFk28S7hxiMmQMPfNLB81grLwRqutQ_7IRCBjG2vsta2qEiCy9KTqnl0mRq1L_wCBe7RhuRu2EdDg4fQqNuhJkcYYBxoX2FBBhJmXNGlsxLRfyeI62a0hvjvhMpmewECh6w5vcHqdqKpvmeIv3F0NLrB1Se0l70hRiySbQtqELNV8I_TTR7GV_alADkG3pkrxOuyfaQnZ9VqM4UfRivyEA',
    signatureDish: 'Bariis iyo Hilib Ari'
  },
  {
    id: 'chef-2',
    name: 'Chef Hodan Jaamac',
    title: 'Khabiirka Macaanka (Pastry Chef)',
    bio: 'Hodan waxay caan ku tahay inay dhadhan aan hore loo arag u yeesho macmacaanka, iyadoo si qurux badan isku dhisaysa farsamooyinka reer galbeedka iyo hiddaha Soomaaliyeed.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAczQ6EnlhtVNRMSmq8ng5_lZSgh4j7Th_iZpkKnVfXRvKYLlE1-vcF7Ou5JnIzkhqF0ns2R7lKGr1Vo6WXlzLcydgfRy42NVokyqBi0LaWLUWhqbk8jJ5wQ_1c8RSSkuAOTC4EDvcI25_PwM_xYkTrQGtGHfKDublEmkHO6lX8ZD7RrYdftkAidMi4QhqmIHVGG-T7RrUmYYfnGuCQ8Lbkxmre_I8WnCvqjtP9hMZsPKd2eRZbHTtGOg',
    signatureDish: 'Tiramisu Special & Xalwo'
  }
];
