# Sources / math — 050 What if a whale swallowed you?

## Facts used in the script
- **Blue whale = biggest animal ever:** NOAA Fisheries calls blue whales the largest animals ever known to have lived; up to ~30 m long (largest recorded ~33.6 m) and up to ~190 t (Guinness).
  - https://www.fisheries.noaa.gov/species/blue-whale
  - https://spc.int/taxonomy/term/2240 (largest recorded blue whale 33.58 m)
  - https://www.guinnessworldrecords.com/world-records/largest-mammal
- **Blue whale throat ~20 cm, "smaller than a beach ball":** the esophagus of a blue whale is roughly 15-25 cm wide (popular figure 4-10 in / ~10-25 cm; GREMM "Baleines en direct": "just 15 to 25 cm ... unable to swallow anything bigger than a beach ball"). The script uses the middle value "about twenty centimetres". Its mouth is huge, but the throat is not: it filters krill.
  - https://baleinesendirect.org/en/could-one-be-eaten-by-a-whale/
  - https://enviroliteracy.org/what-is-the-biggest-thing-a-blue-whale-can-swallow/
  - https://www.whalefacts.org/?p=2873
- **"Your shoulders are twice that":** CDC NHANES III mean biacromial (bone-to-bone) shoulder breadth: men 41.1 cm, women 36.7 cm. 41 / 20 ≈ 2.05; 37 / 20 ≈ 1.8 → "twice that" (rounded). On screen: shoulders ≈ 40 cm.
  - https://www.healthline.com/health/average-shoulder-width (summarises NHANES III, CDC)
- **"But a sperm whale could":** sperm whales are the largest toothed whales (males up to ~16 m / 52 ft). Sperm-whale biologist Shane Gero (Project CETI) told Science Friday a large sperm whale's esophagus is wide enough to pass a person and the largest males could technically swallow a human, although there is NO documented case. (The 1891 "James Bartley" story is an unverified legend.) Anatomist Joy Reidenberg says baleen whales like blue and humpback whales cannot swallow a person.
  - https://www.sciencefriday.com/segments/whalefall-movie-science/
  - https://www.syfy.com/syfy-wire/whalefall-science-explained-by-sperm-whale-expert-shane-gero
  - https://www.sciencenews.org/article/whalefall-movie-whale-swallow-person
  - https://www.fisheries.noaa.gov/species/sperm-whale ; https://myfwc.com/wildlifehabitats/profiles/mammals/aquatic/sperm-whale/ (males up to 52 ft / 15.9 m)
- **"It swallows squid whole. One found in a stomach was ten metres long":** squid are the mainstay of sperm whale diet; usually only beaks are found, but whole squid are sometimes recovered. In July 1955 a sperm whale caught off the Azores held an intact squid of ~34 ft (≈10.4 m) including tentacles, ~405 lb (Robert Clarke, "A giant squid swallowed by a sperm whale", Norsk Hvalfangst-Tidende 1955 (10): 589-593; Budker 1959). (Some 1950s "giant squid" stomach specimens were later re-identified, so the script says "squid", not "giant squid".) 34 ft × 0.3048 = 10.36 m → "ten metres".
  - https://marineinfo.org/doc/publication/364108
  - https://en.wikipedia.org/wiki/List_of_giant_squid_specimens_and_sightings_(20th_century)
  - https://www.tonmo.com/threads/squid-body-from-whale-stomach.3848/
  - https://ocean.si.edu/ocean-life/marine-mammals/giant-squid-vs-sperm-whale
- **Four stomach chambers; first squeezes/crushes, next is full of acid:** Science Friday (with Shane Gero): "Sperm whale stomachs have four separate chambers ... The first stomach squeezes and crushes food ... The second stomach is filled with acid that breaks down food chemically." (Older anatomical studies count 3 compartments + a duodenal ampulla, so "four" follows the common modern description.) The first chamber is a muscular holding stomach without digestive juices (IFLScience).
  - https://www.sciencefriday.com/segments/whalefall-movie-science/
  - https://www.iflscience.com/whalefall-could-a-whale-really-swallow-a-human-heres-what-the-experts-have-to-say-about-if-this-hell-could-actually-happen-84981
  - https://boem.gov/oil-gas-energy/81tissuestructuralstudies
- **"There's no air":** a stomach holds food and fluid, not air; experts note you'd have lost your regulator/mask on the way down (Vanessa Pirotta, IFLScience), so you could only last as long as you can hold your breath.
  - https://www.iflscience.com/whalefall-could-a-whale-really-swallow-a-human-heres-what-the-experts-have-to-say-about-if-this-hell-could-actually-happen-84981
- **2021, humpback, lobster diver Michael Packard, up to 40 s, spat out alive:** 11 June 2021, off Provincetown (Cape Cod), Massachusetts, in ~45 ft (~14 m) of water. Packard said he was in the whale's closed mouth "for about 30 to 40 seconds" before it surfaced and spat him out; he kept breathing from his scuba regulator; hospital with soft-tissue bruising, no broken bones. Center for Coastal Studies: a rare accident (whale lunging at fish); humpbacks have a small esophagus, he could not have been swallowed. The script says "up to forty seconds" (his own estimate).
  - https://www.bostonglobe.com/2021/06/11/metro/lobster-diver-says-he-was-caught-mouth-humpback-whale-off-cape-cod
  - https://www.kuow.org/stories/a-lobster-diver-in-cape-cod-says-a-humpback-whale-scooped-him-up-and-spat-him-out
  - https://www.nbcboston.com/news/local/humpback-whale-catches-lobster-diver-in-its-mouth-sending-him-to-hospital/2403527/
  - https://www.today.com/today/amp/tdna221877

## Python check
```
41.1 / 20 = 2.06 ; 36.7 / 20 = 1.84   -> "twice that" (rounded)
34 ft * 0.3048 = 10.36 m              -> "ten metres"
45 ft * 0.3048 = 13.7 m               -> Packard's depth (on screen: 14 m)
52 ft * 0.3048 = 15.85 m              -> sperm whale males "up to 16 m"
2026 - 2021 = 5 years ago
```
