<template>
  <div class="page-list" id="popmenu">
    <content-layout :showHeader="false" :showPage="false" :defaultPercent="15">
      <template slot="headerrow"> </template>
      <template slot="tree">
        <div class="tree-content">
          <!--          <div class="tree-title" @click="handleTreeNodeClick({ id: '0' })">-->
          <!--            PBS（工程部位）-->
          <!--          </div>-->
          <div class="title">
            <div class="title-icon"></div>
            工程部位
          </div>
          <el-tree
            class="tree-dom"
            ref="pbsTree"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            :load="loadNode"
            highlight-current
            lazy
            :expand-on-click-node="false"
            @node-click="handleTreeNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="node.label"
                placement="top-start"
              >
                <span class="node-label">
                  {{ node.label }}
                </span>
              </el-tooltip>
            </span>
          </el-tree>
        </div>
      </template>
      <template slot="table">
        <div class="table-content">
          <div class="bim-content">
            <bim-engine
              :cid="bimconfig.id"
              ref="bimEngine"
              @inited="bimInited"
            ></bim-engine>
          </div>

          <div class="form-content">
            <el-menu
              default-active="0"
              class="el-menu-vertical-demo info-menu"
              @select="handleOpen"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-menu-item
                v-for="menu in infoMenu"
                :key="menu.index"
                :index="menu.index"
              >
                <span slot="title">{{ menu.name }}</span>
              </el-menu-item>
            </el-menu>
            <div class="info-content">
              <div class="title">
                <div class="title-icon"></div>
                {{
                  activatedMenu.name +
                  (activatedMenu.index !== "0" ? "信息" : "")
                }}
              </div>
              <div class="jbxx info" v-show="activatedMenu.index === '0'">
                <el-row>
                  <el-col :span="5" align="right"
                    >编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</el-col
                  >
                  <el-col :span="19">{{ currentTreeData.code }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right">工程部位：</el-col>
                  <el-col :span="19">{{ currentTreeData.name }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right"
                    >层&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</el-col
                  >
                  <el-col :span="19">{{ currentTreeData.pbsLayerDesc }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right"
                    >类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</el-col
                  >
                  <el-col :span="19">{{ currentTreeData.pbsTypeDesc }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right">施工标段：</el-col>
                  <el-col :span="19">{{ currentTreeData.sectionName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right">施工单位：</el-col>
                  <el-col :span="19">{{
                    currentTreeData.secondUnitName
                  }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5" align="right">监理单位：</el-col>
                  <el-col :span="19">{{ currentTreeData.jldwUnitName }}</el-col>
                </el-row>
              </div>
              <div class="sjgl info" v-show="activatedMenu.index === '1'">
                <div>
                  <div class="flex align-center">
                    <div class="title-line mr-5"></div>
                    <div class="item-title">供应总数</div>
                  </div>
                  <el-carousel
                    indicator-position="outside"
                    :height="'255px'"
                    :interval="5000"
                  >
                    <el-carousel-item
                      v-for="(list, pIndex) in supplyBimCount"
                      :key="pIndex"
                    >
                      <div
                        class="gyzs"
                        v-for="(item, index) in list"
                        :key="index"
                      >
                        <img
                          :src="require('@/assets/img/bimPlus/record.png')"
                        />
                        <span class="gyzs-name">{{ item.DICT_NAME }}</span>
                        <span class="gyzs-value">{{ item.TOTAL }}</span>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="divider-line"></div>
                <div>
                  <div class="flex align-center">
                    <div class="title-line mr-5"></div>
                    <div class="item-title">成果数</div>
                  </div>
                  <div id="gzygycsChartContainer"></div>
                </div>
                <div class="divider-line"></div>
                <div>
                  <div class="flex align-center">
                    <div class="title-line mr-5"></div>
                    <div class="item-title">设计成果列表</div>
                  </div>
                  <el-row>
                    <el-col :span="9" align="center" class="sjwjlb-title"
                      >设计成果名称</el-col
                    >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'计划供应日期'"
                      placement="top-start"
                    >
                      <el-col :span="5" align="center" class="sjwjlb-title"
                        >计划供应日期</el-col
                      >
                    </el-tooltip>

                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'实际供应日期'"
                      placement="top-start"
                    >
                      <el-col :span="5" align="center" class="sjwjlb-title"
                        >实际供应日期</el-col
                      >
                    </el-tooltip>

                    <el-col :span="5" align="center" class="sjwjlb-title"
                      >成果类型</el-col
                    >
                  </el-row>
                  <el-carousel indicator-position="outside" :height="'175px'">
                    <el-carousel-item
                      v-for="(list, pIndex) in supplyFileList"
                      :key="pIndex"
                    >
                      <el-row v-for="(item, index) in list" :key="index">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.name"
                          placement="top-start"
                        >
                          <el-col
                            :span="9"
                            align="center"
                            :class="
                              index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'
                            "
                          >
                            <span class="text-ellipsis">{{ item.name }}</span>
                          </el-col>
                        </el-tooltip>

                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="
                            item.planDate
                              ? $dateFormat(item.planDate, 'YYYY-MM-DD')
                              : ''
                          "
                          placement="top-start"
                        >
                          <el-col
                            :span="5"
                            align="center"
                            :class="
                              index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'
                            "
                          >
                            {{
                              item.planDate
                                ? $dateFormat(item.planDate, "YYYY-MM-DD")
                                : ""
                            }}
                          </el-col>
                        </el-tooltip>

                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="
                            item.actualDate
                              ? $dateFormat(item.actualDate, 'YYYY-MM-DD')
                              : ''
                          "
                          placement="top-start"
                        >
                          <el-col
                            :span="5"
                            align="center"
                            :class="
                              index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'
                            "
                          >
                            {{
                              item.actualDate
                                ? $dateFormat(item.actualDate, "YYYY-MM-DD")
                                : ""
                            }}
                          </el-col>
                        </el-tooltip>

                        <el-col
                          :span="5"
                          align="center"
                          :class="index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'"
                        >
                          {{
                            $DictionaryParsing(
                              sjcgOptionsList,
                              item.resultsType
                            )
                          }}
                        </el-col>
                      </el-row>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
              <div class="zhyw info" v-show="activatedMenu.index === '2'">
                <div class="zhyw-item">
                  <div>业主发文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.ownerSend ? zhywData.ownerSend : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>业主收文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.ownerReceive ? zhywData.ownerReceive : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>设计发文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.designSend ? zhywData.designSend : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>设计收文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.designReceive ? zhywData.designReceive : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>监理发文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.supervisorSend ? zhywData.supervisorSend : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>监理收文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.supervisorReceive
                        ? zhywData.supervisorReceive
                        : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>施工发文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.constructionSend ? zhywData.constructionSend : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>施工收文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.constructionReceive
                        ? zhywData.constructionReceive
                        : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>第三方发文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.thirdPartySend ? zhywData.thirdPartySend : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
                <div class="zhyw-item">
                  <div>第三方收文总数</div>
                  <div>
                    <span class="zhyw-value">{{
                      zhywData.thirdPartyReceive
                        ? zhywData.thirdPartyReceive
                        : 0
                    }}</span
                    ><span>条</span>
                  </div>
                </div>
              </div>
              <div class="jdgl info" v-show="activatedMenu.index === '3'">
                <div class="jdgl-total">
                  <div class="jdgl-total-item">
                    <div>总生产天数</div>
                    <div>
                      <span class="zhyw-value">{{
                        jdjhData.days ? jdjhData.days : 0
                      }}</span
                      ><span>天</span>
                    </div>
                  </div>
                  <div class="jdgl-total-item">
                    <div>总进尺数</div>
                    <!--                    <div><span class="zhyw-value">{{-->
                    <!--                        jdjhData.drillingFootage ? jdjhData.drillingFootage : 0-->
                    <!--                      }}</span><span>m</span></div>-->
                    <div><span class="zhyw-value">-</span></div>
                  </div>
                </div>
                <div class="divider-line"></div>
                <div id="jdglwclChartContainer"></div>
                <div style="text-align: center; font-weight: 550">完成率</div>
                <div class="divider-line"></div>
                <div class="plan-date">
                  <el-row>
                    <el-col :span="8" align="left">计划施工日期：</el-col>
                    <el-col :span="16" align="left"
                      >{{
                        (jdjhData.planStartDate
                          ? timeFormat(jdjhData.planStartDate, "YYYY-MM-DD")
                          : "-") +
                        " ~ " +
                        (jdjhData.planEndDate
                          ? timeFormat(jdjhData.planEndDate, "YYYY-MM-DD")
                          : "-")
                      }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" align="left">实际施工日期：</el-col>
                    <el-col :span="16" align="left"
                      >{{
                        (jdjhData.constructionStartDate
                          ? timeFormat(
                              jdjhData.constructionStartDate,
                              "YYYY-MM-DD"
                            )
                          : "-") +
                        " ~ " +
                        (jdjhData.constructionEndDate
                          ? timeFormat(
                              jdjhData.constructionEndDate,
                              "YYYY-MM-DD"
                            )
                          : "-")
                      }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5" align="left">起桩号：</el-col>
                    <el-col :span="6" align="left">{{
                      jdjhData.startStakeMark ? jdjhData.startStakeMark : 0
                    }}</el-col>
                    <el-col :span="5" align="left">止桩号：</el-col>
                    <el-col :span="6" align="left">{{
                      jdjhData.endStakeMark ? jdjhData.endStakeMark : 0
                    }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5" align="left">当前桩号：</el-col>
                    <!--                    <el-col :span="6" align="left">{{-->
                    <!--                        jdjhData.currentStakeMark ? jdjhData.currentStakeMark : 0-->
                    <!--                      }}-->
                    <!--                    </el-col>-->
                    <el-col :span="6" align="left">-</el-col>
                  </el-row>
                </div>
                <div class="divider-line"></div>
                <el-row>
                  <el-col :span="8" align="center" class="sjwjlb-title"
                    >施工方案编号</el-col
                  >
                  <el-col :span="8" align="center" class="sjwjlb-title"
                    >施工方案名称</el-col
                  >
                  <el-col :span="8" align="center" class="sjwjlb-title"
                    >报审日期</el-col
                  >
                </el-row>
                <el-carousel indicator-position="outside" :height="'350px'">
                  <el-carousel-item v-for="item in 1" :key="item">
                    <el-row>
                      <el-col :span="24" align="center" class="sjwjlb-td"
                        >暂无数据</el-col
                      >
                    </el-row>
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">SGFA-001</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">施工方案名称</el-col>-->
                    <!--                      <el-col :span="8" align="center" class="sjwjlb-td1">2023-10-12</el-col>-->
                    <!--                    </el-row>-->
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="zlgl info" v-show="activatedMenu.index === '4'">
                <div class="plan-date">
                  <el-row>
                    <el-col :span="8" align="left">质量验评结果：</el-col>
                    <el-col :span="16" align="left" style="color: #1298fa"
                      >{{
                        zlglData.result
                          ? zlglData.result === "0"
                            ? "不合格"
                            : zlglData.result === "1"
                            ? "合格"
                            : "优良"
                          : "-"
                      }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" align="left">验评时间：</el-col>
                    <el-col :span="16" align="left">
                      {{
                        zlglData.time
                          ? timeFormat(zlglData.time, "YYYY-MM-DD")
                          : "-"
                      }}
                    </el-col>
                  </el-row>
                </div>
                <div class="divider-line"></div>
                <div class="flex align-center">
                  <div class="title-line mr-5"></div>
                  <div class="item-title">单元工程验评完成情况</div>
                </div>
                <div id="dygcypwcqkChartContainer"></div>
                <div class="divider-line"></div>
                <div class="flex align-center">
                  <div class="title-line mr-5"></div>
                  <div class="item-title">试验检测情况</div>
                </div>
                <div class="position-relative">
                  <div class="clmc-select">
                    <el-select @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="clmcType"
                      :popper-append-to-body="false"
                      @change="clmcChange"
                    >
                      <el-option value="" label="全部" />
                      <el-option
                        v-for="item in clmcList"
                        :key="item.dictCode"
                        :value="item.dictCode"
                        :label="item.dictName"
                      />
                    </el-select>
                  </div>
                  <div class="legend">
                    <span>合格</span>
                    <span>不合格</span>
                  </div>
                  <div id="syjcqkChartContainer"></div>
                </div>
              </div>
              <div class="hsbgl info" v-show="activatedMenu.index === '5'">
                <div class="flex align-center">
                  <div class="title-line mr-5"></div>
                  <div class="item-title">体系文件统计</div>
                </div>
                <div id="txwjtjChartContainer"></div>
                <div class="divider-line"></div>
                <div class="flex align-center">
                  <div class="title-line mr-5"></div>
                  <div class="item-title">环水保方案&环水保措施文件列表</div>
                </div>
                <el-row>
                  <el-col :span="16" align="center" class="sjwjlb-title"
                    >文件名称</el-col
                  >
                  <el-col :span="8" align="center" class="sjwjlb-title"
                    >上传日期</el-col
                  >
                </el-row>
                <el-carousel indicator-position="outside" :height="'350px'">
                  <el-carousel-item
                    v-for="(list, pIndex) in txwjList"
                    :key="pIndex"
                  >
                    <el-row v-for="(item, index) in list" :key="index">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.name"
                        placement="top-start"
                      >
                        <el-col
                          :span="16"
                          align="center"
                          :class="index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'"
                        >
                          <span
                            class="text-ellipsis text-0096 pointer"
                            @click="downTxwjFile(item.uploadFile)"
                            >{{ item.name }}</span
                          >
                        </el-col>
                      </el-tooltip>
                      <el-col
                        :span="8"
                        align="center"
                        :class="index % 2 === 0 ? 'sjwjlb-td' : 'sjwjlb-td1'"
                      >
                        {{ timeFormat(item.createDate, "YYYY-MM-DD") }}
                      </el-col>
                    </el-row>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>
        </div>
      </template>
    </content-layout>
  </div>
</template>

<script>
import {
  list,
  sectionAllList,
  corporates,
  txwjtj,
  zlgl,
  zhyw,
  jdjh,
  supplyBimCount,
  supplyDetailList
} from "./api";
import { getDictItemList } from "@/api/dict";
import enums from "@/config/enums";
import { bimconfig } from "@/config/bimconfig";
import { dateFormat } from "@/utils";
import { BaseMixin } from "@/mixins/BaseMixin";
import ContentLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import BimEngine from "@/components/BimEngine/index";
import * as echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";
import { testResult } from "@/views/qualitySafetyManagement/comprehensiveQualityAnalysis/api";

export default {
  name: "project-pbs",
  mixins: [BaseMixin],
  components: {
    ContentLayout,
    ListButton,
    BimEngine
  },
  data() {
    return {
      txwjList: [],
      infoMenu: [
        {
          index: "0",
          name: "基本信息"
        },
        {
          index: "1",
          name: "设计管理"
        },
        {
          index: "2",
          name: "综合业务"
        },
        {
          index: "3",
          name: "进度与施工"
        },
        {
          index: "4",
          name: "质量管理"
        },
        {
          index: "5",
          name: "环水保管理"
        }
      ],
      /**当前选择树节点 */
      currentTreeData: {},
      currentTreeNode: {},
      oprateRow: {
        /** 信息弹窗*/
        dialogShow: false,
        /**当前行数据 */
        data: {},
        /**是否是查看 */
        isView: false
      },

      /**树结构默认属性 */
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "hasChild"
      },
      treeData: [],
      /**请求参数 */
      queryParams: { pid: 0 },
      url: { list: "/api/project/section/page" },

      /**层级 */
      pbsLayerOptions: enums.PBS_LAYER_ENUM,
      /**类型 */
      pbsTypeOptions: enums.PBS_TYPE_ENUM,

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
      activatedMenu: {
        index: "0",
        name: "基本信息"
      },
      sjcgOptionsList: [],
      sectionList: [],
      clmcList: [],
      clmcType: "",
      unitList: [],
      zlglData: "",
      zhywData: "",
      jdjhData: "",
      supplyBimCount: [],
      supplyFileList: "",
      gzygtcsChart: {
        chart: "",
        option: ""
      },
      jdglwclChart: {
        chart: "",
        option: ""
      },
      dygcypwcqkChart: {
        chart: "",
        option: ""
      },
      syjcqkChart: {
        chart: "",
        option: ""
      },
      txwjtjChart: {
        chart: "",
        option: ""
      }
    };
  },
  computed: {},
  created() {
    this.initTree();
    this.getSjcgDictItemList();
  },
  mounted() {
    this.getClmcList();
    // 默认阻止右键事件冒泡
    this.$nextTick(() => {
      document.oncontextmenu = function () {
        return false;
      };
    });
    this.getSectionAllList();
    this.getUnitList();

    this.initGzygtcsChart();
    this.initJdglwclChart();
    this.initDygcypwcqkChart();
    this.initSyjcqkChart();
    this.initTxwjtjChart();
  },
  methods: {
    /**获取成果类型字典 */
    async getSjcgDictItemList() {
      if (!this.sjcgOptionsList || this.sjcgOptionsList.length === 0) {
        let res = await Promise.all([
          getDictItemList("design_sjcglx"),
          getDictItemList("cglx-ydbd")
        ]);
        console.log("获取成果类型字典d", res);
        let allDit = [];
        res.forEach((x) => {
          allDit = allDit.concat(x.data);
        });
        this.sjcgOptionsList = allDit.filter(
          (item) => item.dictCode !== "sjcglx" && item.dictCode !== "sbcglx"
        );
      } else {
      }
    },
    /**
     * 树节点点击
     * 传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
     */
    handleTreeNodeClick(data, node, ve) {
      console.log(data);
      console.log(node);

      let pbsLayer = "";
      if (data.pbsLayer) {
        let layer = this.pbsLayerOptions.find((x) => x.value === data.pbsLayer);
        if (layer) {
          pbsLayer = layer.name;
        }
      }
      data.pbsLayerDesc = pbsLayer;
      let pbsType = "";
      if (data.pbsType) {
        let type = this.pbsTypeOptions[data.pbsLayer]?.find(
          (x) => x.value === data.pbsType
        );
        if (type) {
          pbsType = type.name;
        }
      }
      data.pbsTypeDesc = pbsType;

      let section = this.sectionList.find((item) => item.id === data.sectionId);
      console.log(section);
      if (section) {
        data.sectionName = section.name;
        let secondUnit = this.unitList.find(
          (item) => item.corpId === section.secondUnit
        );
        if (secondUnit) {
          data.secondUnitName = secondUnit?.corpName;
        }
        let jldwDetail = section.children.find((item) => item.type === "jldw");
        if (jldwDetail) {
          let jldwUnit = this.unitList.find(
            (item) => item.corpId === jldwDetail.unitId
          );
          data.jldwUnitName = jldwUnit?.corpName;
        }
      }

      this.currentTreeData = data;
      this.currentTreeNode = node;
      console.log("data", data);

      //右侧明细
      this.getGzygtcsData();
      this.getJdglwclData();
      this.getZhywData();
      this.getDygcypwcqkData();
      this.getSyjcqkData();
      this.getTxwjtjData();

      //模型处理
      this.bimHandle(data.bimCode);
    },
    getZhywData() {
      zhyw({ pbsCode: this.currentTreeData?.code }).then((res) => {
        if (res.success) {
          this.zhywData = res.data;
        }
      });
    },
    /**
     * 各专业供应次数
     */
    getGzygtcsData() {
      this.gzygtcsChart.chart.showLoading();
      // supplyBimCategory(this.currentTreeData?.code).then((res) => {
      //   if (res.success) {
      //     let data = [];
      //     res.data.forEach(item => {
      //       data.push({
      //         name: item.PROFESSION,
      //         value: item.num
      //       })
      //     })
      //     this.gzygtcsChart.option.series[0].data = data;
      //     this.gzygtcsChart.option.legend.data = [data.length > 0 ? data[0].name : ''];
      //     this.gzygtcsChart.chart.setOption(this.gzygtcsChart.option);
      //     this.gzygtcsChart.chart.hideLoading()
      //   }
      // });

      supplyBimCount(this.currentTreeData?.code).then((res) => {
        if (res.success) {
          this.supplyBimCount = [];
          let resData = res.data;
          for (let i = 0; i < Math.ceil(resData.length / 4); i++) {
            this.supplyBimCount.push(
              resData.slice(
                i * 4,
                (i + 1) * 4 > resData.length ? resData.length : (i + 1) * 4
              )
            );
          }

          let data = [];
          resData.forEach((item) => {
            data.push({
              name: item.DICT_NAME,
              value: item.TOTAL
            });
          });
          this.gzygtcsChart.option.series[0].data = data;
          this.gzygtcsChart.option.legend.data = [
            data.length > 0 ? data[0].name : ""
          ];
          this.gzygtcsChart.chart.setOption(this.gzygtcsChart.option);
          this.gzygtcsChart.chart.hideLoading();
        }
      });

      supplyDetailList({ pbsCode: this.currentTreeData?.code }).then((res) => {
        if (res.success) {
          this.supplyFileList = [];
          let fileList = res.data;
          for (let i = 0; i < Math.ceil(fileList.length / 5); i++) {
            this.supplyFileList.push(
              fileList.slice(
                i * 5,
                (i + 1) * 5 > fileList.length ? fileList.length : (i + 1) * 5
              )
            );
          }
        }
      });
    },
    initGzygtcsChart() {
      let thiss = this;
      let chartDom = document.getElementById("gzygycsChartContainer");
      this.gzygtcsChart.chart = echarts.init(chartDom);
      // 定义图表的配置项和数据

      this.gzygtcsChart.option = {
        title: {
          text: "成果数",
          left: "center",
          top: "58%",
          padding: [0, 0],
          textStyle: {
            fontSize: 15,
            align: "center",
            color: "#605f5f"
          }
        },
        legend: {
          selectedMode: false,
          formatter: function (name) {
            let total = 0;
            thiss.gzygtcsChart.option.series[0].data.forEach((item) => {
              total += Number(item.value);
            });
            return "{total|" + total + "}";
          },
          data: [""],
          left: "center",
          top: "center",
          icon: "none",
          align: "center",
          textStyle: {
            color: "#ccc",
            fontSize: 14,
            rich: {
              total: {
                color: "#1D2129",
                fontSize: 40,
                align: "center"
              }
            }
          }
        },
        tooltip: {
          trigger: "item"
        },

        series: [
          {
            name: "供应次数",
            type: "pie",

            itemStyle: {
              borderRadius: 2,
              borderColor: "#fff",
              borderWidth: 1
            },
            label: {
              show: true,
              formatter(param) {
                // correct the percentage
                return param.name + " " + param.value + "次";
              }
            },
            radius: ["40%", "70%"],
            data: []
          }
        ]
      };

      this.gzygtcsChart.chart.setOption(this.gzygtcsChart.option);
      window.addEventListener("resize", () => {
        this.gzygtcsChart.chart.resize();
      });
    },
    /**
     * 进度与施工-完成率
     */
    getJdglwclData() {
      this.jdglwclChart.chart.showLoading();
      // quer2().then((res) => {
      //   if (res.success) {
      //     this.info2 = res.data;
      //     this.planChange1Config.option.series[0].data = [
      //       {
      //         name: "在线",
      //         value: this.info2.online,
      //       },
      //       {
      //         name: "离线",
      //         value: this.info2.offline,
      //       },
      //     ];
      //     this.planChange1Config.chart.setOption(
      //       this.planChange1Config.option
      //     );
      //     this.planChange1Config.chart.hideLoading()
      //   }
      // });
      jdjh({ pbsCode: this.currentTreeData?.code }).then((res) => {
        if (res.success) {
          this.jdjhData = res.data;
          if (res.data.constructionStartDate && res.data.constructionEndDate) {
            this.jdjhData.days = Math.ceil(
              (res.data.constructionEndDate - res.data.constructionStartDate) /
                (24 * 60 * 60 * 1000)
            );
            let startStakeMark = Number(
              res.data.startStakeMark ? res.data.startStakeMark : 0
            );
            let endStakeMark = Number(
              res.data.endStakeMark ? res.data.endStakeMark : 0
            );
            let drillingFootage = Number(
              res.data.drillingFootage ? res.data.drillingFootage : 0
            );
            let completeRate = 0;
            if (endStakeMark - startStakeMark > 0) {
              completeRate = Number(
                drillingFootage / (endStakeMark - startStakeMark)
              ).toFixed(2);
              if (completeRate > 1) {
                completeRate = 1;
              }
            }
            this.jdglwclChart.option.series[0].data = [
              completeRate,
              completeRate - 0.1
            ];
            this.jdglwclChart.chart.setOption(this.jdglwclChart.option);
          }
          this.jdglwclChart.chart.hideLoading();
        }
      });
    },
    initJdglwclChart() {
      let chartDom = document.getElementById("jdglwclChartContainer");
      this.jdglwclChart.chart = echarts.init(chartDom);
      // 定义图表的配置项和数据

      this.jdglwclChart.option = {
        series: [
          {
            type: "liquidFill",
            radius: "90%",
            color: ["#50B5FF", "#1298FA"],
            data: [0, -0.1],
            amplitude: "10px",
            animationDuration: 0,
            animationDurationUpdate: 2000,
            animationEasingUpdate: "cubicOut",
            outline: {
              itemStyle: {
                borderColor: "rgba(129,195,254,1)",
                borderWidth: 2
              }
            },
            label: {
              normal: {
                //此处没有生效，本地生效
                textStyle: {
                  fontSize: 20,
                  color: "#1298FA"
                }
              }
            },
            backgroundStyle: {
              color: "#D9EFFF"
            }
          }
        ]
      };
      this.jdglwclChart.chart.setOption(this.jdglwclChart.option);
      window.addEventListener("resize", () => {
        this.jdglwclChart.chart.resize();
      });
    },
    /**
     * 质量管理-单元工程验评完成情况
     */
    getDygcypwcqkData() {
      this.dygcypwcqkChart.chart.showLoading();
      zlgl({ pbsCode: this.currentTreeData?.code }).then((res) => {
        if (res.success) {
          this.zlglData = res.data;
          this.dygcypwcqkChart.option.series[0].data[0].value = res.data
            .qualityCount
            ? res.data.qualityCount
            : 0;
          this.dygcypwcqkChart.option.series[2].data[0].value = res.data
            .meritRatio
            ? (1 - res.data.meritRatio) * 100
            : 100;
          this.dygcypwcqkChart.option.series[2].data[1].value = res.data
            .meritRatio
            ? res.data.meritRatio
            : 0;
          this.dygcypwcqkChart.option.series[3].data[0].value = res.data
            .passRate
            ? (1 - res.data.passRate) * 100
            : 100;
          this.dygcypwcqkChart.option.series[3].data[1].value = res.data
            .passRate
            ? res.data.passRate * 100
            : 0;
          this.dygcypwcqkChart.chart.setOption(this.dygcypwcqkChart.option);
          this.dygcypwcqkChart.chart.hideLoading();
        }
      });
    },
    initDygcypwcqkChart() {
      let chartDom = document.getElementById("dygcypwcqkChartContainer");
      this.dygcypwcqkChart.chart = echarts.init(chartDom);
      // 定义图表的配置项和数据

      this.dygcypwcqkChart.option = {
        title: [
          {
            text: "",
            left: "center",
            show: false
          },
          {
            subtext: "验评数量",
            left: "14.67%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129"
            }
          },
          {
            subtext: "验评优良率",
            top: "85%",
            left: "48%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129"
            }
          },
          {
            subtext: "验评合格率",
            left: "82%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129"
            }
          }
        ],
        xAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          // 内圆
          {
            type: "pie",
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0,
            radius: ["0", "65%"],
            center: ["50%", "50%"],
            z: 4,
            hoverAnimation: false,
            data: [
              {
                name: "积分",
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: "rgb(66,150,249)"
                      },
                      {
                        offset: 1,
                        color: "rgb(83,186,254)"
                      }
                    ])
                  }
                },
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#fff",
                        align: "center",
                        fontSize: 30,
                        padding: [0, 0, 0, 0],
                        fontWeight: "bold"
                      }
                    },
                    formatter: function (params) {
                      return "{a|" + params.value + "}";
                    },
                    position: "center",
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }
            ]
          },
          // 外一层圈
          {
            type: "pie",
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0,
            radius: "80%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1
              }
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgb(215,236,255)"
                    },
                    {
                      offset: 1,
                      color: "rgb(194,223,255)"
                    }
                  ]
                }
              }
            }
          },
          {
            type: "pie",
            radius: ["70%", "80%"],
            center: ["50%", "50%"],
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgb(216,220,223)"
                  }
                }
              },
              {
                value: 0,
                label: {
                  show: true,
                  position: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  formatter: (item) => {
                    return `{total| ${item.value || 0} }%`;
                  },
                  rich: {
                    total: {
                      fontSize: 18,
                      textAlign: "center",
                      color: "#1d2129",
                      lineHeight: 21
                    },
                    title: {
                      lineHeight: 16,
                      color: "#86909c",
                      fontSize: 14
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: "rgb(74,147,255)"
                  }
                }
              }
            ],
            labelLine: {
              show: false
            },
            left: "33.3333%",
            right: "33.3333%",
            top: 0,
            bottom: 0
          },
          {
            type: "pie",
            radius: ["70%", "80%"],
            center: ["50%", "50%"],
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgb(216,220,223)"
                  }
                }
              },
              {
                value: 0,
                label: {
                  show: true,
                  position: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  formatter: (item) => {
                    return `{total| ${item.value || 0} }%`;
                  },
                  rich: {
                    total: {
                      fontSize: 18,
                      textAlign: "center",
                      color: "#1d2129",
                      lineHeight: 21
                    },
                    title: {
                      lineHeight: 16,
                      color: "#86909c",
                      fontSize: 14
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: "rgb(74,147,255)"
                  }
                }
              }
            ],

            labelLine: {
              show: false
            },
            left: "66.6667%",
            right: 0,
            top: 0,
            bottom: 0
          }
        ]
      };
      this.dygcypwcqkChart.chart.setOption(this.dygcypwcqkChart.option);
      window.addEventListener("resize", () => {
        this.dygcypwcqkChart.chart.resize();
      });
    },
    /**
     * 质量管理-试验检测情况
     */
    getSyjcqkData() {
      this.syjcqkChart.chart.showLoading();
      const params = {
        pbsCode: this.currentTreeData?.code,
        clmc: this.clmcType
      };
      testResult(params).then((res) => {
        const data = res.data || [];
        const reagent = data.find((x) => x.type === "reagent");
        const supervision = data.find((x) => x.type === "supervision");
        const work = data.find((x) => x.type === "work");
        if (work.hgNum + work.bhgNum !== 0) {
          this.syjcqkChart.option.series[0].data = [
            {
              name: "合格",
              value: work.hgNum,
              total: work.hgNum + work.bhgNum
            },
            {
              name: "不合格",
              value: work.bhgNum,
              total: work.hgNum + work.bhgNum
            }
          ];
        } else {
          this.syjcqkChart.option.series[0].data = [
            {
              name: "合格",
              value: work.hgNum,
              total: work.hgNum + work.bhgNum
            }
          ];
        }
        if (supervision.hgNum + supervision.bhgNum !== 0) {
          this.syjcqkChart.option.series[1].data = [
            {
              name: "合格",
              value: supervision.hgNum,
              total: supervision.hgNum + supervision.bhgNum
            },
            {
              name: "不合格",
              value: supervision.bhgNum,
              total: supervision.hgNum + supervision.bhgNum
            }
          ];
        } else {
          this.syjcqkChart.option.series[1].data = [
            {
              name: "合格",
              value: supervision.hgNum,
              total: supervision.hgNum + supervision.bhgNum
            }
          ];
        }
        if (reagent.hgNum + reagent.bhgNum !== 0) {
          this.syjcqkChart.option.series[2].data = [
            {
              name: "合格",
              value: reagent.hgNum,
              total: reagent.hgNum + reagent.bhgNum
            },
            {
              name: "不合格",
              value: reagent.bhgNum,
              total: reagent.hgNum + reagent.bhgNum
            }
          ];
        } else {
          this.syjcqkChart.option.series[2].data = [
            {
              name: "合格",
              value: reagent.hgNum,
              total: reagent.hgNum + reagent.bhgNum
            }
          ];
        }
        this.syjcqkChart.chart.setOption(this.syjcqkChart.option);
        this.syjcqkChart.chart.hideLoading();
      });
    },
    initSyjcqkChart() {
      let chartDom = document.getElementById("syjcqkChartContainer");
      this.syjcqkChart.chart = echarts.init(chartDom);
      // 定义图表的配置项和数据

      this.syjcqkChart.option = {
        tooltip: {
          trigger: "item"
        },
        title: [
          {
            text: "",
            left: "center",
            show: false
          },
          {
            subtext: "施工单位自检",
            left: "14.67%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 15,
              color: "#1d2129"
            }
          },
          {
            subtext: "监理单位检测",
            top: "85%",
            left: "48%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 15,
              color: "#1d2129"
            }
          },
          {
            subtext: "试验中心检测",
            left: "82.33%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 15,
              color: "#1d2129"
            }
          }
        ],

        color: ["#1AD2CE", "#FCC59F"],
        series: [
          {
            type: "pie",
            radius: ["70%", "80%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14
                }
              }
            },
            labelLine: {
              show: false
            },
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0
          },
          {
            type: "pie",
            radius: ["70%", "80%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14
                }
              }
            },
            labelLine: {
              show: false
            },
            left: "33.3333%",
            right: "33.3333%",
            top: 0,
            bottom: 0
          },
          {
            type: "pie",
            radius: ["70%", "80%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14
                }
              }
            },
            labelLine: {
              show: false
            },
            left: "66.6667%",
            right: 0,
            top: 0,
            bottom: 0
          }
        ]
      };
      this.syjcqkChart.chart.setOption(this.syjcqkChart.option);
      window.addEventListener("resize", () => {
        this.syjcqkChart.chart.resize();
      });
    },
    /**
     * 环水保管理-体系文件统计
     */
    getTxwjtjData() {
      this.txwjtjChart.chart.showLoading();
      txwjtj({ pbsCode: this.currentTreeData.code }).then((res) => {
        console.log(res);
        if (res.success) {
          this.txwjtjChart.option.series[0].data[0].value =
            res.data.countList[0].count;
          this.txwjtjChart.option.series[2].data[0].value =
            res.data.countList[1].count;
          this.txwjtjChart.option.series[4].data[0].value =
            res.data.countList[2].count;
          this.txwjtjChart.chart.setOption(this.txwjtjChart.option);
          this.txwjtjChart.chart.hideLoading();
          this.txwjList = [];
          let fileList = res.data.fileList;
          for (let i = 0; i < Math.ceil(fileList.length / 10); i++) {
            this.txwjList.push(
              fileList.slice(
                i * 10,
                (i + 1) * 10 > fileList.length ? fileList.length : (i + 1) * 10
              )
            );
          }
        }
      });
    },
    initTxwjtjChart() {
      let chartDom = document.getElementById("txwjtjChartContainer");
      this.txwjtjChart.chart = echarts.init(chartDom);
      // 定义图表的配置项和数据

      this.txwjtjChart.option = {
        title: [
          {
            text: "",
            left: "center",
            show: false
          },
          {
            subtext: "环水保方案",
            left: "14.67%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 14,
              color: "#1d2129"
            }
          },
          {
            subtext: "环水保报告",
            top: "85%",
            left: "48%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 14,
              color: "#1d2129"
            }
          },
          {
            subtext: "环水保措施文件",
            left: "81.33%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 14,
              color: "#1d2129"
            }
          }
        ],
        xAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          // 内圆
          {
            type: "pie",
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0,
            radius: ["0", "65%"],
            center: ["50%", "50%"],
            z: 4,
            hoverAnimation: false,
            data: [
              {
                name: "积分",
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: "rgb(66,150,249)"
                      },
                      {
                        offset: 1,
                        color: "rgb(83,186,254)"
                      }
                    ])
                  }
                },
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#fff",
                        align: "center",
                        fontSize: 30,
                        padding: [0, 0, 0, 0],
                        fontWeight: "bold"
                      }
                    },
                    formatter: function (params) {
                      return "{a|" + params.value + "}";
                    },
                    position: "center",
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }
            ]
          },
          // 外一层圈
          {
            type: "pie",
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0,
            radius: "80%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 0
              }
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgb(215,236,255)"
                    },
                    {
                      offset: 1,
                      color: "rgb(194,223,255)"
                    }
                  ]
                }
              }
            }
          },

          // 内圆
          {
            type: "pie",
            left: "33.3333%",
            right: "33.3333%",
            top: 0,
            bottom: 0,
            radius: ["0", "65%"],
            center: ["50%", "50%"],
            z: 4,
            hoverAnimation: false,
            data: [
              {
                name: "积分",
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: "rgb(66,150,249)"
                      },
                      {
                        offset: 1,
                        color: "rgb(83,186,254)"
                      }
                    ])
                  }
                },
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#fff",
                        align: "center",
                        fontSize: 30,
                        padding: [0, 0, 0, 0],
                        fontWeight: "bold"
                      }
                    },
                    formatter: function (params) {
                      return "{a|" + params.value + "}";
                    },
                    position: "center",
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }
            ]
          },
          // 外一层圈
          {
            type: "pie",
            left: "33.3333%",
            right: "33.3333%",
            top: 0,
            bottom: 0,
            radius: "80%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1
              }
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgb(215,236,255)"
                    },
                    {
                      offset: 1,
                      color: "rgb(194,223,255)"
                    }
                  ]
                }
              }
            }
          },
          // 内圆
          {
            type: "pie",
            left: "66.6667%",
            right: 0,
            top: 0,
            bottom: 0,
            radius: ["0", "65%"],
            center: ["50%", "50%"],
            z: 4,
            hoverAnimation: false,
            data: [
              {
                name: "积分",
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: "rgb(66,150,249)"
                      },
                      {
                        offset: 1,
                        color: "rgb(83,186,254)"
                      }
                    ])
                  }
                },
                label: {
                  normal: {
                    rich: {
                      a: {
                        color: "#fff",
                        align: "center",
                        fontSize: 30,
                        padding: [0, 0, 0, 0],
                        fontWeight: "bold"
                      }
                    },
                    formatter: function (params) {
                      return "{a|" + params.value + "}";
                    },
                    position: "center",
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }
            ]
          },
          // 外一层圈
          {
            type: "pie",
            left: "66.6667%",
            right: 0,
            top: 0,
            bottom: 0,
            radius: "80%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1
              }
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgb(215,236,255)"
                    },
                    {
                      offset: 1,
                      color: "rgb(194,223,255)"
                    }
                  ]
                }
              }
            }
          }
        ]
      };
      this.txwjtjChart.chart.setOption(this.txwjtjChart.option);
      window.addEventListener("resize", () => {
        this.txwjtjChart.chart.resize();
      });
    },
    clmcChange(val) {
      this.clmcType = val;
      if (this.currentTreeData?.code) {
        this.getSyjcqkData();
      }
    },
    /**
     * @description 获取字典(材料名称)
     */
    getClmcList() {
      this.$store.dispatch("dict/get", "syjc").then((res) => {
        this.clmcList = res.filter((item) => {
          return item.dictPath.split(",").length === 3;
        });
        console.log(this.clmcList);
      });
    },
    getSectionAllList() {
      sectionAllList({}).then((res) => {
        console.log(res);
        if (res.success) {
          this.sectionList = res.data;
        }
      });
    },
    async getUnitList() {
      const { data, success } = await corporates();
      if (success) {
        this.unitList = data;
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      this.activatedMenu = this.infoMenu[key];
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //模型加载后
    bimInited() {
      console.log(this.bimconfig, "模型配置");
      let featureIds = this.bimconfig.hiddenId;
      //隐藏相关构件
      if (featureIds && featureIds.length > 0) {
        for (let i = 0; i < featureIds.length; i++) {
          const featureId = featureIds[i];
          let modelTag = featureId.split("^")[0];
          let id = featureId.split("^")[1];
          this.$refs.bimEngine.setItemVisible([id], false, modelTag);
        }
      }

      //设置模型虚化
      this.$refs.bimEngine.initModelAlpha();
    },
    /**初始化 */
    initTree() {
      this.treeData = [];
      this.loadNode();
    },
    removeTreeNode(node, data) {
      const parent = node.parent;
      const children = parent.childNodes || [];
      const index = children.findIndex((d) => d.data.id === data.id);
      if (index >= 0) {
        children.splice(index, 1);
      }
    },
    appendTreeNode(data) {
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },

    /**保存成功以后 */
    saveAfter(data) {
      //判断是新增还是编辑，树上能不能直接处理好
      // this.initTree();
      console.log("this.currentTreeData", this.currentTreeData, data);
      if (this.currentTreeNode && this.currentTreeData.id === data.id) {
        //编辑
        this.currentTreeNode.data = { ...data };
      } else {
        //新增
        if (data.pid === "0") {
          this.$refs.pbsTree.append(data);
        } else {
          this.$refs.pbsTree.append(data, this.currentTreeData);
        }
      }
    },
    /**获取列表数据 */
    loadNode(node, resolve) {
      console.log("loadNode", node);
      // let root = {
      //   id: "0",
      //   name: "PBS（工程部位）",
      // };
      // if (node == null) {
      //   this.treeData = [];
      //   return;
      // }

      // if (node.level === 0) {
      //   return resolve([]);
      // }

      // if (node.data.hasChild === 0) {
      //   return resolve([]);
      // }

      if (!resolve) {
        this.treeData = [];
      }
      let queryParams = {};
      if (node && node.data) {
        queryParams.pid = node.data.id;
      } else {
        queryParams.pid = 0;
      }
      list(queryParams).then((res) => {
        if (res.success) {
          if (resolve) {
            res.data = res.data.map((item) => {
              item.hasChild = item.hasChild === 0;
              return item;
            });
            resolve(res.data);
          }
          // else {
          //   this.treeData = res.data;
          // }
        }
      });
    },
    /**查找树*/
    treeFind(tree, func) {
      for (const data of tree) {
        if (func(data)) return data;
        if (data.children) {
          const res = this.treeFind(data.children, func);
          if (res) return res;
        }
      }
      return null;
    },
    /**判断分类是否有建筑物父级*/
    flHasJzwParent(node) {
      if (node.pid === "0") return false;
    },
    /**模型处理 */
    bimHandle(bimCode) {
      //通过code进行渲染
      this.$refs.bimEngine.render(bimCode);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    downTxwjFile(uploadFile) {
      let arr = JSON.parse(uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$downFileById(arr[0]);
      }
    },
    downSjtzFile(row) {
      console.log(row);
      this.$downFileById(row);
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;

  // el-tree 选中项背景颜色
  ::v-deep
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    // 设置颜色
    background-color: #e6f9ff; // 背景色
    font-weight: bold; // 字体加粗
    .node-label {
      color: #1298fa; // 节点的字体颜色
    }
  }

  // el-tree 悬浮样式
  ::v-deep .el-tree-node__content:hover {
    .node-label {
      color: #5bacf8;
    }

    background-color: #e8f9ff;
  }

  // el-tree 鼠标聚焦样式
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff;
  }

  .tree-title {
    margin: 5px;
    cursor: pointer;
  }

  .tree-content {
    height: 100%;
    border: 1px solid #eee;

    .tree-dom {
      margin: 10px;
      margin-left: 0px;
      height: calc(100% - 70px);
      overflow-y: auto;
    }
  }

  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;

    //&:hover {
    //  .command-content {
    //    display: block;
    //  }
    //}

    .node-label {
      width: calc(100% - 40px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .command-content {
      position: absolute;
      right: 0px;
      z-index: 1;
      display: none;
    }

    .el-icon-more {
      transform: rotate(90deg);
    }
  }

  .table-content {
    width: 100%;
    height: calc(100% - 0px);
    position: relative;
    display: flex;

    .bim-content {
      border: 1px solid #eee;
      width: 66.6%;
      margin: 0px 10px 0px 10px;
      border-right: 1px solid #eee;
    }

    .form-content {
      display: flex;
      margin: 0px 10px 0px 0px;
      border: 1px solid #eee;
      width: 33.3%;
    }
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: white !important;
}

.info-menu {
  width: 20%;
}

.info-content {
  width: 80%;
  background: #ecf4fc;
  overflow: auto;

  .jbxx {
    padding: 10px;
  }

  .info {
    line-height: 33px;
    color: #6d7886;
  }

  .sjgl {
    padding: 10px;

    .gyzs {
      display: flex;
      color: #fff;
      background: linear-gradient(147deg, #2e92f6 0%, #67b3ff 100%);
      border-radius: 6px 6px 6px 6px;
      margin-top: 10px;
      align-items: center;
      padding: 10px;

      img {
        width: 20px;
        height: 22px;
        margin: 0 10px;
      }

      .gyzs-name {
        width: 170px;
        font-size: 18px;
      }

      .gyzs-value {
        font-size: 22px;
        margin-left: 30px;
      }
    }
  }

  .zhyw,
  .jdgl-total {
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-evenly;

    .zhyw-item,
    .jdgl-total-item {
      width: 40%;
      background: linear-gradient(
        180deg,
        rgba(18, 152, 250, 0.81) 0%,
        #1298fa 100%
      );
      border: 1px solid rgba(18, 152, 250, 0.2);
      color: #fff;
      padding: 10px;
      margin: 10px;
    }

    .zhyw-value {
      font-size: 28px;
      margin-right: 10px;
      font-weight: 550;
    }
  }

  .zlgl {
    padding: 10px;
  }

  .hsbgl {
    padding: 10px;
  }
}

.title {
  background: linear-gradient(90deg, #218bf4 0%, #cfe6ff 100%);
  box-shadow: 0px 4px 6px 0px rgba(42, 144, 245, 0.06);
  font-size: 23px;
  color: #fff;
  margin-bottom: 10px;
  padding: 16px;
  position: relative;
}

.title-icon {
  width: 3px;
  height: 80%;
  background: #feb74d;
  position: absolute;
  left: 0;
  top: 10%;
}

.title-line {
  width: 3px;
  height: 10px;
  background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

.item-title {
  font-size: 15px;
  color: #1d2129;
  font-weight: 550;
}

.divider-line {
  background: #e5e6eb;
  height: 1px;
  width: 100%;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

#gzygycsChartContainer {
  width: 400px;
  height: 300px;
  margin: auto;
}

#jdglwclChartContainer {
  width: 150px;
  height: 150px;
  margin: auto;
}

#dygcypwcqkChartContainer {
  width: 400px;
  height: 200px;
  margin: auto;
}

#syjcqkChartContainer {
  width: 400px;
  height: 200px;
  margin: auto;
}

#txwjtjChartContainer {
  width: 400px;
  height: 200px;
  margin: auto;
}

.sjwjlb-title {
  background: #1298fa;
  color: #fff;
  border-right: 1px solid #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sjwjlb-td {
  background: #ecf4fc;
  color: #6d7886;
  border: 1px solid #d8efff;
}

.sjwjlb-td1 {
  background: #d8efff;
  color: #6d7886;
  border: 1px solid #d8efff;
}

.sjwjlb-td,
.sjwjlb-td1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plan-date {
  padding-left: 30px;
}

.clmc-select {
  position: absolute;
  right: 75px;
  z-index: 99999;
  width: 150px;
}

/deep/ .el-col-5 {
  word-break: keep-all;
}

.legend {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 14px;
  span {
    &::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #1ad2ce;
      margin: 0 5px;
    }
    &:first-child {
      &::before {
        background-color: #1ad2ce;
      }
    }
    &:last-child {
      &::before {
        background-color: #fcc59f;
      }
    }
  }
}

@media screen and (max-width: 1920px) {
  /deep/ .el-row {
    font-size: 15px;
  }

  /deep/ .el-menu-item {
    padding: 0 10px !important;
  }

  #gzygycsChartContainer {
    width: 330px;
    height: 200px;
    margin: auto;
  }

  #dygcypwcqkChartContainer,
  #syjcqkChartContainer,
  #txwjtjChartContainer {
    width: 300px;
    height: 200px;
    margin: auto;
  }

  .title {
    font-size: 20px;
    margin-bottom: 0;
    padding: 10px;
  }

  .sjwjlb-title,
  .sjwjlb-td,
  .sjwjlb-td1 {
    font-size: 12px;
  }

  .plan-date {
    padding-left: 10px;
  }

  .clmc-select {
    right: 15px;
  }

  .info-content {
    .sjgl {
      padding: 5px;

      .gyzs {
        margin-top: 5px;
        padding: 5px;

        img {
          width: 16px;
          height: 18px;
          margin: 0 10px;
        }

        .gyzs-name {
          width: 140px;
          font-size: 15px;
        }

        .gyzs-value {
          font-size: 18px;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
