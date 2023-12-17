import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice Garcia',
      password: await hashPassword('passwordAlice')
    }
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob Marley',
      password: await hashPassword('passwordBob')
    }
  });
  const erling = await prisma.user.upsert({
    where: { email: 'erling@prisma.io' },
    update: {},
    create: {
      email: 'erling@prisma.io',
      name: 'Erling Haaland',
      password: await hashPassword('passwordErling')
    }
  });
  const shopA = await prisma.shop.create({
    data: {
      title: 'Textile House - second hand',
      address: 'Poštovská 68/3, 602 00 Brno-střed',
      description: 'Second-hand shop from a Textil-house chain. Offers all kinds of clothes, mainly for women.',
      longitude: 49.194690876087016,
      latitude: 16.61131840963104,
      imageURL:
        'https://textilehouse.cz/wp-content/uploads/2020/01/WhatsApp-Image-2023-03-03-at-12.57.53-1400x1208.jpeg'
    }
  });
  const shopB = await prisma.shop.create({
    data: {
      title: 'Genesis Second Hand',
      address: 'Štefánikova 2, 602 00 Brno-Královo Pole',
      description: 'Second-hand shop from a Genesis chain. Located near the main train station',
      imageURL:
        'https://www.thestylemon.com/wp-content/uploads/2020/07/nejlepsi_najlepsie_secondhandy_v_brne_sekace_genesis_brno_2.jpg',
      longitude: 49.19189685372957,
      latitude: 16.61185116412235
    }
  });
  const shopC = await prisma.shop.create({
    data: {
      title: 'Charlie Fashion',
      address: 'Josefská 706/19, 602 00 Brno-střed',
      description:
        'Neďaleko Retro Komnaty nájdete ďalší second hand, ktorý je však trochu iný. Nájdete tam aj nové oblečenie s visačkami, najčastejšie značiek ako Zara, Bershka či New Look. ',
      imageURL:
        'https://www.thestylemon.com/wp-content/uploads/2020/07/nejlepsi_najlepsie_secondhandy_v_brne_sekace_charlie_fashion.jpg',
      longitude: 49.20801174212071,
      latitude: 16.60423802448318
    }
  });
  const shopD = await prisma.shop.create({
    data: {
      title: 'Slow Bazar Praha',
      address: 'Řeznická 1741, 110 00 Nové Město, Praha',
      description:
        'low Bazar prodává prémiovou značkovou módu z druhé ruky. Čeká vás tu pestrá nabídka značek, kvalitní zboží, špičkový zákaznický servis a příjemná atmosféra.',
      imageURL: 'https://lh5.googleusercontent.com/p/AF1QipNgPHtvP89Ezq0jqb6xaAVDuDKDNRB2M9HnN1XM=w408-h306-k-no',
      longitude: 50.07820694574507,
      latitude: 14.42434668415572
    }
  });
  const shopE = await prisma.shop.create({
    data: {
      title: 'Textil House - vintage shop',
      address: 'Orlí 477/16, 602 00 Brno-střed',
      description:
        'low Bazar prodává prémiovou značkovou módu z druhé ruky. Čeká vás tu pestrá nabídka značek, kvalitní zboží, špičkový zákaznický servis a příjemná atmosféra.',
      imageURL: 'https://lh5.googleusercontent.com/p/AF1QipOGgBIO-ms3DHS5OuBxKZr5LqTF7odnSel_cuLT=w408-h306-k-no',
      longitude: 49.19334624256341,
      latitude: 16.61118024721986
    }
  });
  const reviewA = await prisma.review.create({
    data: {
      userId: alice.id,
      shopId: shopA.id,
      starsGiven: 5,
      content:
        'Tento sekáč navštevujem najčastejšie z jednoduchého dôvodu. Je priamo v centre, kolekcie sa casto menia a ceny su prijemne.'
    }
  });
  const eventA = await prisma.event.create({
    data: {
      authorId: bob.id,
      title: 'Christmas charity donation',
      description:
        'Come to the charity house at tr. Kpt. Jarose 9 in Brno and donate your clothes to the the people, who can not afford it',
      startDate: '2023-12-21T23:00:00.000Z'
    }
  });
  console.log({ alice, bob, erling, shopA, shopB, shopC, shopD, shopE, reviewA, eventA });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
