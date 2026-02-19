/**
 * Ramadan daily duas (day 1-30) and authentic adhkar.
 * All content is from prophetic hadith with references (Sahih al-Bukhari, Sahih Muslim, etc.).
 * Sources: Yaqeen Institute (A Du'a a Day), Sunnah.com, and agreed-upon hadith collections.
 */

export interface DailyDua {
  day: number
  arabic: string
  english: string
  reference: string
}

export interface TasbihatPhrase {
  id?: string
  title?: string
  arabic: string
  transliteration?: string
  english: string
  note?: string
  sunnah_specific?: boolean
}

export interface TasbihatPart {
  part: number
  reference?: string
  phrases: TasbihatPhrase[]
}

export interface CategorizedDua {
  id: string
  arabic: string
  english: string
  transliteration?: string
  reference: string
}

export interface DuaCategory {
  id: string
  label: string
  duas: CategorizedDua[]
}

export interface AshraDua {
  id: string
  title: string
  arabic: string
  transliteration: string
  translation: string
  note: string
  sunnah_specific: boolean
  startDay: number
  endDay: number
}

export const ADHKAR_ATTRIBUTION =
  'Authentic prophetic duas and adhkar from Sahih al-Bukhari, Sahih Muslim, and other agreed-upon hadith collections.'

export const ashraDuas: AshraDua[] = [
  {
    id: 'ashra_1_mercy',
    title: '1st Ashra - Mercy',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    transliteration: 'Ya Hayyu Ya Qayyum, bi-rahmatika astaghith',
    translation: 'O Ever-Living, O Sustainer, in Your mercy I seek relief',
    note: 'Permissible dua. Not established as specific Sunnah for first 10 days.',
    sunnah_specific: false,
    startDay: 1,
    endDay: 10,
  },
  {
    id: 'ashra_2_forgiveness',
    title: '2nd Ashra - Forgiveness',
    arabic: 'أَسْتَغْفِرُ ٱللّٰهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha rabbi min kulli dhanbin wa atubu ilayh',
    translation: 'I seek forgiveness from Allah, my Lord, from every sin and repent to Him',
    note: 'Permissible dua. Not established as specific Sunnah for middle 10 days.',
    sunnah_specific: false,
    startDay: 11,
    endDay: 20,
  },
  {
    id: 'ashra_3_protection',
    title: '3rd Ashra - Protection from Hellfire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ ٱلنَّارِ',
    transliteration: 'Allahumma ajirni min an-nar',
    translation: 'O Allah, save me from the Hellfire',
    note: 'Permissible dua. Not established as specific Sunnah for last 10 days.',
    sunnah_specific: false,
    startDay: 21,
    endDay: 30,
  },
]

export const dailyDuas: DailyDua[] = [
  {
    day: 1,
    arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    english: 'O Allah, guide me and keep me upright.',
    reference: 'Sahih Muslim',
  },
  {
    day: 2,
    arabic: 'رَبِّ اهْدِنِي وَيَسِّرِ الْهُدَى لِي',
    english: 'My Lord, guide me and make guidance easy for me.',
    reference: 'Sunan at-Tirmidhi, Sunan Abi Dawud, Ibn Majah',
  },
  {
    day: 3,
    arabic:
      'اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا أَنْتَ وَلِيُّهَا وَمَوْلاَهَا',
    english:
      'O Allah, give my soul its God-fearing righteousness (taqwa) and purify it, for You are the best to purify it. You are its Protector and its Guardian.',
    reference: 'Sahih Muslim',
  },
  {
    day: 4,
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَىَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    english:
      'O Allah, You are my Lord, there is no God but You. You created me and I am Your servant. I seek refuge in You from the evil that I have committed. I acknowledge Your favor upon me and my sin, so forgive me, for surely none can forgive sins but You.',
    reference: 'Sahih al-Bukhari (Sayyid al-Istighfar)',
  },
  {
    day: 5,
    arabic:
      'اللَّهُمَّ اغْفِرْ لي ذَنْبِي كُلَّهُ دِقَّهُ وجِلَّهُ وأَوَّلَهُ وآخِرَهُ وعَلانِيَتَهُ وسِرَّهُ',
    english:
      'O Allah, forgive all of my sins: the small and great, the first and the last, the public and the private.',
    reference: 'Sahih Muslim',
  },
  {
    day: 6,
    arabic:
      'اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ وَأَنْتَ عَلَى كُلِّ شَىْءٍ قَدِيرٌ',
    english:
      'O Allah, forgive me for my past and future sins, what I have done secretly and openly. You are the One who brings forward and the One who delays, and You have power over all things.',
    reference: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    day: 7,
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    english: 'O Turner of hearts, set firm my heart upon Your religion.',
    reference: 'Sunan at-Tirmidhi',
  },
  {
    day: 8,
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ',
    english: 'O Allah, I ask You for steadfastness in the matter (of religion) and determination upon guidance.',
    reference: 'Sunan at-Tirmidhi, Sunan an-Nasa\'i',
  },
  {
    day: 9,
    arabic:
      'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا وَعَنْ يَمِينِي نُورًا وَعَنْ يَسَارِي نُورًا وَفَوْقِي نُورًا وَتَحْتِي نُورًا وَأَمَامِي نُورًا وَخَلْفِي نُورًا وَاجْعَلْ لِي نُورًا',
    english:
      'O Allah, place light in my heart, in my sight and hearing, on my right and left, above me and below me, in front of me and behind me. Grant me light.',
    reference: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    day: 10,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ صلى الله عليه وسلم وَأَعُوذُ بِكَ مِنْ شَرِّ مَا اسْتَعَاذَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ صلى الله عليه وسلم',
    english:
      'O Allah, I ask You for the good that Your Prophet Muhammad asked You for, and I seek refuge in You from the evil from which Your Prophet Muhammad sought refuge.',
    reference: 'Sunan at-Tirmidhi',
  },
  {
    day: 11,
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    english:
      'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the torment of the Fire.',
    reference: 'Sahih al-Bukhari 6389, Sahih Muslim (from Qur\'an 2:201)',
  },
  {
    day: 12,
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ وَمِنْ قَلْبٍ لَا يَخْشَعُ وَمِنْ نَفْسٍ لَا تَشْبَعُ وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا',
    english:
      'O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that is not humble, from a soul that is not satisfied, and from a supplication that is not answered.',
    reference: 'Sahih Muslim',
  },
  {
    day: 13,
    arabic:
      'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ',
    english:
      'O Allah, guide me among those You have guided, grant me wellbeing among those You have granted wellbeing, take me as ally among those You have taken as ally, bless me in what You have given me, and protect me from the evil of what You have decreed.',
    reference: 'Sunan Abi Dawud, Sunan at-Tirmidhi',
  },
  {
    day: 14,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    english:
      'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    reference: 'Sahih Muslim',
  },
  {
    day: 15,
    arabic:
      'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    english:
      'O Allah, forgive me, have mercy on me, guide me, grant me wellbeing, and provide for me.',
    reference: 'Sahih Muslim',
  },
  {
    day: 16,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا اللَّهُ بِأَنَّكَ الْوَاحِدُ الأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ أَنْ تَغْفِرَ لِي ذُنُوبِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    english:
      'O Allah, I ask You by virtue of Your being the One, the Eternal, the Self-Sufficient who begets not nor was begotten and there is none like unto Him, that You forgive my sins. You are the Forgiving, the Merciful.',
    reference: 'Sunan Abi Dawud, Sunan at-Tirmidhi',
  },
  {
    day: 17,
    arabic:
      'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزَنَ إِذَا شِئْتَ سَهْلًا',
    english:
      'O Allah, there is no ease except in what You make easy, and You make the difficult easy when You will.',
    reference: 'Sahih Ibn Hibban',
  },
  {
    day: 18,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ',
    english:
      'O Allah, I ask You for the good of this day and the good of what follows it, and I seek refuge in You from the evil of this day and the evil of what follows it.',
    reference: 'Sahih Muslim',
  },
  {
    day: 19,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    english:
      'O Allah, I ask You for pardon and wellbeing in this world and the next.',
    reference: 'Sunan Abi Dawud, Sunan Ibn Majah',
  },
  {
    day: 20,
    arabic:
      'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    english:
      'O Allah, protect me from in front of me and from behind me, from my right and my left, and from above me, and I seek refuge in Your greatness from being taken from below me.',
    reference: 'Sunan Abi Dawud, Sunan at-Tirmidhi',
  },
  {
    day: 21,
    arabic:
      'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    english:
      'O Allah, set right for me my religion which is the safeguard of my affairs; set right for me my worldly affairs wherein is my livelihood; set right for me my Hereafter wherein is my return; make life for me a source of abundance for every good and make death for me a rest from every evil.',
    reference: 'Sahih Muslim',
  },
  {
    day: 22,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ وَتَرْكَ الْمُنْكَرَاتِ وَحُبَّ الْمَسَاكِينِ وَأَنْ تَغْفِرَ لِي وَتَرْحَمَنِي',
    english:
      'O Allah, I ask You to enable me to do good deeds and abandon evil ones, and to love the poor; and that You forgive me and have mercy on me.',
    reference: 'Sunan at-Tirmidhi',
  },
  {
    day: 23,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَجْئَةِ الْخَيْرِ وَأَعُوذُ بِكَ مِنْ فَجْئَةِ الشَّرِّ',
    english:
      'O Allah, I ask You for the sudden coming of good, and I seek refuge in You from the sudden coming of evil.',
    reference: 'Sunan Abi Dawud',
  },
  {
    day: 24,
    arabic:
      'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي لِسَانِي نُورًا وَاجْعَلْ فِي سَمْعِي نُورًا وَفِي بَصَرِي نُورًا وَمِنْ فَوْقِي نُورًا وَمِنْ تَحْتِي نُورًا وَعَنْ يَمِينِي نُورًا وَعَنْ شِمَالِي نُورًا وَأَمَامِي نُورًا وَخَلْفِي نُورًا وَاجْعَلْ فِي نَفْسِي نُورًا وَأَعْظِمْ لِي نُورًا',
    english:
      'O Allah, place light in my heart, light on my tongue, light in my hearing, light in my sight, light above me, light below me, light on my right, light on my left, light before me, light behind me, and place light in my soul and make light great for me.',
    reference: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    day: 25,
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    english:
      'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from being overcome by debt and from being overpowered by men.',
    reference: 'Sahih al-Bukhari',
  },
  {
    day: 26,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا اللَّهُ الْوَاحِدُ الأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ أَنْ تَغْفِرَ لِي ذُنُوبِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    english:
      'O Allah, I ask You, O Allah the One, the Eternal, the Self-Sufficient who begets not nor was begotten and there is none like unto Him, that You forgive my sins. You are the Forgiving, the Merciful.',
    reference: 'Sunan an-Nasa\'i',
  },
  {
    day: 27,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ الْمَنَّانُ يَا بَدِيعَ السَّمَاوَاتِ وَالْأَرْضِ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ يَا حَيُّ يَا قَيُّومُ',
    english:
      'O Allah, I ask You by virtue of all praise being Yours; there is no god but You, the Bestower of favors, Originator of the heavens and the earth, Possessor of majesty and honor, O Living, O Self-Sustaining.',
    reference: 'Sunan an-Nasa\'i',
  },
  {
    day: 28,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ الأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    english:
      'O Allah, I ask You by my testifying that You are Allah, there is no god but You, the One, the Eternal, who begets not nor was begotten and there is none like unto Him.',
    reference: 'Sunan Abi Dawud, Sunan at-Tirmidhi',
  },
  {
    day: 29,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا فِي هَذِهِ اللَّيْلَةِ وَفَتْحَ خَيْرِهَا وَدَفْعَ شَرِّهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا',
    english:
      'O Allah, I ask You for the good of this night and the opening of its good and the repelling of its evil; and I seek refuge in You from the evil of it and the evil after it.',
    reference: 'Sunan Abi Dawud',
  },
  {
    day: 30,
    arabic:
      'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    english:
      'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    reference: 'Sunan Abi Dawud 2357 (dua when breaking the fast)',
  },
]

export const dailyTasbihatIntro =
  'Recite these authentic remembrances from the Prophet (peace be upon him). Each is narrated in the agreed-upon or well-authenticated hadith collections.'

export const dailyTasbihat: TasbihatPart[] = [
  {
    part: 1,
    reference: 'Sahih Muslim 2692',
    phrases: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: "SubhanAllahi wa bihamdihi",
        english:
          'Glory be to Allah and praise be to Him. The Prophet (peace be upon him) said: He who recites this in the morning and evening one hundred times will not be surpassed on the Day of Resurrection by anyone with better deeds.',
      },
    ],
  },
  {
    part: 2,
    reference: 'Sahih Muslim 2694',
    phrases: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
        transliteration: "SubhanAllahi wa bihamdihi SubhanAllahil 'Azim",
        english:
          'Glory and praise be to Allah, glory be to Allah the Almighty. These are two phrases light on the tongue, heavy on the scale, and dear to the Merciful.',
      },
    ],
  },
  {
    part: 3,
    reference: 'Sahih Muslim 2675',
    phrases: [
      {
        arabic:
          'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي وَأَنَا مَعَهُ حِينَ يَذْكُرُنِي إِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي وَإِنْ ذَكَرَنِي فِي مَلَإٍ ذَكَرْتُهُ فِي مَلَإٍ خَيْرٍ مِنْهُمْ',
        english:
          'Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me. If he remembers Me in himself, I remember him in Myself; if he remembers Me in a gathering, I remember him in a gathering better than that.',
      },
    ],
  },
  {
    part: 4,
    reference: 'Sahih al-Bukhari 6406',
    phrases: [
      {
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration:
          "La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamd wa huwa 'ala kulli shay'in qadir",
        english:
          'There is no god but Allah alone, with no partner; His is the dominion and His is the praise, and He is over all things competent. The Prophet said these words are very dear to the Merciful.',
      },
    ],
  },
  {
    part: 5,
    reference: 'Sahih Muslim 2691',
    phrases: [
      {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        transliteration: 'La hawla wa la quwwata illa billah',
        english:
          'There is no power and no strength except with Allah. It is one of the treasures of Paradise.',
      },
    ],
  },
  {
    part: 6,
    reference: 'Sahih al-Bukhari 3113',
    phrases: [
      {
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration: 'Allahumma a\'inni ala dhikrika wa shukrika wa husni ibadatika',
        english:
          'O Allah, help me to remember You, thank You, and worship You in the best manner.',
      },
    ],
  },
  {
    part: 7,
    reference: 'Sahih Muslim 2702',
    phrases: [
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ',
        english:
          'O Allah, I seek refuge in You from the decline of Your favor, the change of Your wellbeing, the suddenness of Your punishment, and all that may incur Your displeasure.',
      },
    ],
  },
  {
    part: 8,
    reference: 'Sahih Muslim 2726',
    phrases: [
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Alhamdulillahi Rabbil \'alamin',
        english:
          'All praise is due to Allah, Lord of the worlds. Filling the scale and filling the space between heaven and earth.',
      },
    ],
  },
  {
    part: 9,
    reference: 'Sahih al-Bukhari 3293',
    phrases: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
        transliteration:
          "SubhanAllahi wal hamdulillahi wa la ilaha illallah wallahu akbar",
        english:
          'Glory be to Allah, praise be to Allah, there is no god but Allah, and Allah is greater. The Prophet loved these words.',
      },
    ],
  },
  {
    part: 10,
    reference: 'Sahih Muslim 2695',
    phrases: [
      {
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
        transliteration: 'Allahumma inni as\'alukal \'afiyah',
        english:
          'O Allah, I ask You for wellbeing. The Prophet said: Ask Allah for wellbeing, for after certainty of faith none is given a better gift than wellbeing.',
      },
    ],
  },
  {
    part: 11,
    phrases: [
      {
        id: ashraDuas[0].id,
        title: ashraDuas[0].title,
        arabic: ashraDuas[0].arabic,
        transliteration: ashraDuas[0].transliteration,
        english: ashraDuas[0].translation,
        note: ashraDuas[0].note,
        sunnah_specific: ashraDuas[0].sunnah_specific,
      },
    ],
  },
  {
    part: 12,
    phrases: [
      {
        id: ashraDuas[1].id,
        title: ashraDuas[1].title,
        arabic: ashraDuas[1].arabic,
        transliteration: ashraDuas[1].transliteration,
        english: ashraDuas[1].translation,
        note: ashraDuas[1].note,
        sunnah_specific: ashraDuas[1].sunnah_specific,
      },
    ],
  },
  {
    part: 13,
    phrases: [
      {
        id: ashraDuas[2].id,
        title: ashraDuas[2].title,
        arabic: ashraDuas[2].arabic,
        transliteration: ashraDuas[2].transliteration,
        english: ashraDuas[2].translation,
        note: ashraDuas[2].note,
        sunnah_specific: ashraDuas[2].sunnah_specific,
      },
    ],
  },
]

export const duaCategories: DuaCategory[] = [
  {
    id: 'morning',
    label: 'Morning Adhkar',
    duas: [
      {
        id: 'morning-1',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        english: 'We have reached the morning, and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner. To Him belongs the dominion, and to Him belongs all praise, and He has power over all things.',
        transliteration: "Asbahna wa asbahal mulku lillah, wal hamdu lillah, la ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadir",
        reference: 'Sunan Abi Dawud 5071',
      },
      {
        id: 'morning-2',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        english: 'O Allah, by Your grace we have reached the morning, and by Your grace we reach the evening. By Your grace we live and by Your grace we die, and unto You is the resurrection.',
        transliteration: 'Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namutu wa ilaykan nushur',
        reference: 'Sunan at-Tirmidhi 3391',
      },
      {
        id: 'morning-3',
        arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
        english: 'O Allah, whatever blessing I or any of Your creation has risen upon this morning is from You alone, without partner, so for You is all praise and to You is all thanks.',
        transliteration: 'Allahumma ma asbaha bi min ni\'matin aw bi ahadin min khalqika faminka wahdaka la sharika lak, falakal hamdu wa lakash shukr',
        reference: 'Sunan Abi Dawud 5073',
      },
      {
        id: 'morning-4',
        arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لَا إِلَهَ إِلَّا أَنْتَ',
        english: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no god but You.',
        transliteration: 'Allahumma \'afini fi badani, Allahumma \'afini fi sam\'i, Allahumma \'afini fi basari, la ilaha illa ant',
        reference: 'Sunan Abi Dawud 5090',
      },
      {
        id: 'morning-5',
        arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا',
        english: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.',
        transliteration: 'Raditu billahi rabban, wa bil islami dinan, wa bi Muhammadin sallallahu alayhi wa sallam nabiyya',
        reference: 'Sunan Abi Dawud 5072, Sunan at-Tirmidhi 3389',
      },
    ],
  },
  {
    id: 'evening',
    label: 'Evening Adhkar',
    duas: [
      {
        id: 'evening-1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        english: 'We have reached the evening, and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without any partner.',
        transliteration: "Amsayna wa amsal mulku lillah, wal hamdu lillah, la ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadir",
        reference: 'Sunan Abi Dawud 5071',
      },
      {
        id: 'evening-2',
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        english: 'O Allah, by Your grace we have reached the evening, and by Your grace we reach the morning. By Your grace we live and by Your grace we die, and unto You is the final return.',
        transliteration: 'Allahumma bika amsayna wa bika asbahna, wa bika nahya wa bika namutu wa ilaykal masir',
        reference: 'Sunan at-Tirmidhi 3391',
      },
      {
        id: 'evening-3',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
        reference: 'Sahih Muslim 2708',
      },
      {
        id: 'evening-4',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
        english: 'O Allah, I ask You for pardon and wellbeing in this life and the next. O Allah, I ask You for pardon and wellbeing in my religion, my worldly affairs, my family, and my wealth.',
        transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyata fid dunya wal akhirah. Allahumma inni as'alukal 'afwa wal 'afiyata fi dini wa dunyaya wa ahli wa mali",
        reference: 'Sunan Abi Dawud 5074, Sunan Ibn Majah 3871',
      },
      {
        id: 'evening-5',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        english: 'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
        transliteration: 'Bismillahil ladhi la yadurru ma\'asmihi shay\'un fil ardi wa la fis sama\'i wa huwas sami\'ul \'alim',
        reference: 'Sunan Abi Dawud 5088, Sunan at-Tirmidhi 3388',
      },
    ],
  },
  {
    id: 'iftar',
    label: 'Breaking Fast (Iftar)',
    duas: [
      {
        id: 'iftar-1',
        arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        english: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
        transliteration: "Dhahaba adh-dhama'u wabtallatil 'uruqu wa thabatal ajru insha'Allah",
        reference: 'Sunan Abi Dawud 2357',
      },
      {
        id: 'iftar-2',
        arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        english: 'O Allah, I fasted for You and I break my fast with Your provision.',
        transliteration: 'Allahumma inni laka sumtu wa \'ala rizqika aftartu',
        reference: 'Sunan Abi Dawud 2358',
      },
      {
        id: 'iftar-3',
        arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        english: 'In the Name of Allah, and with the blessings of Allah.',
        transliteration: 'Bismillahi wa \'ala barakatillah',
        reference: 'Sunan Abi Dawud 3767',
      },
    ],
  },
  {
    id: 'laylatul-qadr',
    label: 'Laylatul Qadr',
    duas: [
      {
        id: 'qadr-1',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        english: 'O Allah, You are the Pardoner, You love to pardon, so pardon me.',
        transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
        reference: 'Sunan at-Tirmidhi 3513 (narrated by Aisha, may Allah be pleased with her)',
      },
      {
        id: 'qadr-2',
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
        english: 'Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing. And turn to us in mercy. Indeed, You are the Accepting of repentance, the Merciful.',
        reference: "Qur'an 2:127-128",
      },
      {
        id: 'qadr-3',
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        english: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.',
        reference: "Qur'an 14:40",
      },
    ],
  },
  {
    id: 'eating',
    label: 'Before & After Eating',
    duas: [
      {
        id: 'eating-1',
        arabic: 'بِسْمِ اللَّهِ',
        english: 'In the Name of Allah. (Said before eating.)',
        transliteration: 'Bismillah',
        reference: 'Sahih Muslim 2017, Sunan Abi Dawud 3767',
      },
      {
        id: 'eating-2',
        arabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
        english: 'In the Name of Allah at its beginning and at its end. (If you forget to say Bismillah before eating.)',
        transliteration: 'Bismillahi fi awwalihi wa akhirihi',
        reference: 'Sunan Abi Dawud 3767, Sunan at-Tirmidhi 1858',
      },
      {
        id: 'eating-3',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        english: 'All praise is due to Allah who has fed me this and provided it for me without any power or might on my part.',
        transliteration: "Alhamdu lillahil ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        reference: 'Sunan at-Tirmidhi 3458, Sunan Abi Dawud 4023',
      },
    ],
  },
  {
    id: 'mosque',
    label: 'Entering & Leaving Mosque',
    duas: [
      {
        id: 'mosque-1',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        english: 'O Allah, open for me the gates of Your mercy. (When entering the mosque.)',
        transliteration: "Allahummaftah li abwaba rahmatik",
        reference: 'Sahih Muslim 713',
      },
      {
        id: 'mosque-2',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        english: 'O Allah, I ask You from Your bounty. (When leaving the mosque.)',
        transliteration: "Allahumma inni as'aluka min fadlik",
        reference: 'Sahih Muslim 713',
      },
    ],
  },
]
