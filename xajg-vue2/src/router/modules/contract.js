import Layout from "@/layout";

const route = {
  path: "/contract",
  component: Layout,
  redirect: "/contract/contractSign",
  name: "contract",
  meta: {
    title: "合同管理",
    icon: "icon-design",
    auth: "contract",
  },
  children: [
    {
      path: "contractSign",
      component: () => import("@/views/contract/contractSign/index.vue"),
      name: "contractSign",
      meta: { title: "合同登记", auth: "contract" },
    },
    {
      path: "contractLedger",
      component: () => import("@/views/contract/contractLedger/index.vue"),
      name: "contractLedger",
      meta: { title: "合同台账", auth: "contract" },
    },
    {
      path: "investGeneralPay",
      component: () => import("@/views/contract/investGeneralPay/index.vue"),
      name: "investGeneralPay",
      meta: { title: "付款申请", auth: "contract", noCache: true },
    },
    {
      path: "investGeneralPay1",
      component: () => import("@/views/contract/investGeneralPay1/index.vue"),
      name: "investGeneralPay1",
      meta: { title: "非工程合同结算", auth: "contract", noCache: true },
    },
    {
      path: "contractChange",
      component: () => import("@/views/contract/contractChange/index.vue"),
      name: "contractChange",
      meta: { title: "合同变更", auth: "contract" },
    },
    {
      path: "cost",
      component: () => import("@/views/contract/cost/index.vue"),
      name: "contractCost",
      meta: { title: "合同费用管理", auth: "cost" },
    },
  ],
};
export default route;
