import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: await hashPassword('passwordAlice')
    }
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: await hashPassword('passwordBob')
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
  console.log({ alice, bob, shopA, shopB, shopC, reviewA, eventA });
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
