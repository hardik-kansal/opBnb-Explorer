import {
  Text,
  Heading,
  Stack,
  SimpleGrid,
  Button,
  Wrap,
  Image,
  chakra,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Section, AppHeader } from "@/components/common";
import _ from "lodash";
import { DESCRIPTION } from "@/constants/texts";
import { AnimatePresence } from "framer-motion";
import { LatestBlockCard } from "@/components/Card/LatestBlockCard";
import { LatestTransactionCard } from "@/components/Card/LatestTransactionCard";
import { LatestStackCustomScroll } from "@/components/HomePage/LatestStackCustomScroll";
import { chains } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import Link from "next/link";
import { MainLogo } from "@/components/common/MainLogo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getAllTagByChain } from "@/services/tag";
import { InfoTooltip } from "@/components/Tooltips/InfoTooltip";
import { IChainTags } from "@/interfaces/tag";
import { getTxCount } from "@/services/stats";
import { ITxCountStats } from "@/interfaces/stats";
import { TxCountChart } from "@/components/Chart/TxCountChart";
import { SearchInput } from "@/components/Input/SearchInput";
import { DiscoverTagSection } from "@/components/HomePage/DiscoverTagSection";
import { setCacheHeader } from "@/utils/header";

interface IHomePageProps {
  allTags: IChainTags[] | null;
  txCount: ITxCountStats[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 4 hours
  setCacheHeader(context.res, 14400);

  const [allTags, txCount] = await Promise.all([
    getAllTagByChain(),
    getTxCount(),
  ]);
  return {
    props: {
      allTags,
      txCount,
    },
  };
}) satisfies GetServerSideProps<IHomePageProps>;

export const HomePage = ({ allTags, txCount }: IHomePageProps) => {
  const { txs, blocks } = useLatest({
    initialBlocks: [],
    initialTxs: [],
  });

  return (
   <>
    <div style={{
      width: '100%',
      height: '100%',
      opacity: 0.95,
      zIndex:-5,
      backgroundImage: `url('./bg.webp')`, // Replace 'your_image_url.jpg' with your actual image URL
      backgroundSize: 'cover', // Adjust background size as needed
      backgroundPosition: 'center', 
      // Adjust background position as needed
      // Add other styles as needed
    }}>    

    <AppHeader title="Home" />
      <Section>
        <Stack align="center" textAlign="center">
          {/* <MainLogo boxSize={24} /> */}
          <Heading>
      <chakra.span color="black">opBNB Explorer</chakra.span>
          </Heading>
          <Text color='black'>{DESCRIPTION}</Text>
        </Stack>
  
        <SearchInput hasDetails />

        <Stack spacing={[4, null, 8]} divider={<Divider />}>
          {txCount?.length && (
            <Stack spacing={[0, 2]}>
              <HStack>
                <Heading size="md" color='black'>Transaction Count</Heading>
                <InfoTooltip msg="Related transaction counts over 5 days period" />
              </HStack>
              <TxCountChart stats={txCount} />
            </Stack>
          )}

          <DiscoverTagSection tags={allTags || []} />

          <SimpleGrid columns={[1, null, 2]} spacing={[4, null, 8]}>
            <Stack>
              <HStack justify="space-between">
                <Heading size="md" color='black'>Latest Blocks</Heading>
                <Button
                  as={Link}
                  href="/latest/blocks"
                  variant="outline"
                  size="sm"
                  color='black'
                  borderColor="black" 
                  borderWidth="2px" 
                >
                  View All
                </Button>
              </HStack>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {blocks.slice(0, 12).map((block, i) => (
                    <LatestBlockCard key={block.hash} index={i} {...block} />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
            <Stack>
              <HStack justify="space-between">
                <Heading size="md" color='black'>Latest Transactions</Heading>
                <Button
                  as={Link}
                  href="/latest/txs"
                  variant="outline"
                  size="sm"
                  color='black'
                  borderColor="black" 
                  borderWidth="2px"
                >
                  View All
                </Button>
              </HStack>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {txs.slice(0, 10).map((tx, i) => (
                    <LatestTransactionCard
                      key={tx.transaction_hash}
                      index={i}
                      {...tx}
                    />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Section>
      </div>
      </>

  );
};
