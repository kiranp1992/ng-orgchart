import { Injectable, EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodeSelectService {
    constructor() {
        this.subject = new Subject();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    sendSelect(id) {
        this.subject.next({ id });
    }
    /**
     * @return {?}
     */
    clearSelect() {
        this.subject.next();
    }
    /**
     * @return {?}
     */
    getSelect() {
        return this.subject.asObservable();
    }
}
NodeSelectService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NodeSelectService.ctorParameters = () => [];
if (false) {
    /**
     * @type {?}
     * @private
     */
    NodeSelectService.prototype.subject;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ChartContainerComponent {
    /**
     * @param {?} nodeSelectService
     */
    constructor(nodeSelectService) {
        this.nodeSelectService = nodeSelectService;
        this.nodeHeading = 'name';
        this.nodeContent = 'title';
        this.groupScale = 3;
        this.pan = false;
        this.zoom = false;
        this.zoomoutLimit = 0.5;
        this.zoominLimit = 7;
        this.containerClass = '';
        this.chartClass = '';
        this.select = 'single';
        this.nodeClick = new EventEmitter();
        this.chartClick = new EventEmitter();
        this.cursorVal = 'default';
        this.panning = false;
        this.startX = 0;
        this.startY = 0;
        this.transformVal = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    panEndHandler() {
        this.panning = false;
        this.cursorVal = 'default';
    }
    /**
     * @param {?} e
     * @return {?}
     */
    panHandler(e) {
        /** @type {?} */
        let newX = 0;
        /** @type {?} */
        let newY = 0;
        if (!e.targetTouches) {
            // pand on desktop
            newX = e.pageX - this.startX;
            newY = e.pageY - this.startY;
        }
        else if (e.targetTouches.length === 1) {
            // pan on mobile device
            newX = e.targetTouches[0].pageX - this.startX;
            newY = e.targetTouches[0].pageY - this.startY;
        }
        else if (e.targetTouches.length > 1) {
            return;
        }
        if (this.transformVal === '') {
            if (this.transformVal.indexOf('3d') === -1) {
                this.transformVal = 'matrix(1,0,0,1,' + newX + ',' + newY + ')';
            }
            else {
                this.transformVal =
                    'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + newX + ', ' + newY + ',0,1)';
            }
        }
        else {
            /** @type {?} */
            const matrix = this.transformVal.split(',');
            if (this.transformVal.indexOf('3d') === -1) {
                matrix[4] = newX.toString();
                matrix[5] = newY + ')';
            }
            else {
                matrix[12] = newX.toString();
                matrix[13] = newY.toString();
            }
            this.transformVal = matrix.join(',');
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    panStartHandler(e) {
        if (e.target.querySelectorAll('.node') && e.target.querySelectorAll('.node').length) {
            this.panning = false;
            return;
        }
        else {
            this.cursorVal = 'move';
            this.panning = true;
        }
        /** @type {?} */
        let lastX = 0;
        /** @type {?} */
        let lastY = 0;
        if (this.transformVal !== '') {
            /** @type {?} */
            const matrix = this.transformVal.split(',');
            if (this.transformVal.indexOf('3d') === -1) {
                lastX = parseInt(matrix[4], 10);
                lastY = parseInt(matrix[5], 10);
            }
            else {
                lastX = parseInt(matrix[12], 10);
                lastY = parseInt(matrix[13], 10);
            }
        }
        if (!e.targetTouches) {
            // pand on desktop
            this.startX = e.pageX - lastX;
            this.startY = e.pageY - lastY;
        }
        else if (e.targetTouches.length === 1) {
            // pan on mobile device
            this.startX = e.targetTouches[0].pageX - lastX;
            this.startY = e.targetTouches[0].pageY - lastY;
        }
        else if (e.targetTouches.length > 1) {
            return;
        }
    }
    /**
     * @param {?} newScale
     * @return {?}
     */
    setChartScale(newScale) {
        /** @type {?} */
        let matrix = [];
        /** @type {?} */
        let targetScale = 1;
        if (this.transformVal === '') {
            this.transformVal =
                'matrix(' + newScale + ', 0, 0, ' + newScale + ', 0, 0)';
        }
        else {
            matrix = this.transformVal.split(',');
            if (this.transformVal.indexOf('3d') === -1) {
                targetScale = Math.abs(parseFloat(matrix[3]) * newScale);
                if (targetScale > this.zoomoutLimit && targetScale < this.zoominLimit) {
                    matrix[0] = 'matrix(' + targetScale;
                    matrix[3] = targetScale;
                    this.transformVal = matrix.join(',');
                }
            }
            else {
                targetScale = Math.abs(parseFloat(matrix[5]) * newScale);
                if (targetScale > this.zoomoutLimit && targetScale < this.zoominLimit) {
                    matrix[0] = 'matrix3d(' + targetScale;
                    matrix[5] = targetScale;
                    this.transformVal = matrix.join(',');
                }
            }
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    zoomHandler(e) {
        /** @type {?} */
        const newScale = 1 + (e.deltaY > 0 ? -0.2 : 0.2);
        this.setChartScale(newScale);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onClickChart(e) {
        if (!e.target.closest('.oc-node')) {
            this.chartClick.emit();
            this.nodeSelectService.clearSelect();
        }
    }
    /**
     * @param {?} nodeData
     * @return {?}
     */
    onNodeClick(nodeData) {
        this.nodeClick.emit(nodeData);
    }
}
ChartContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'organization-chart',
                template: "<div class=\"orgchart-container\" [ngClass]=\"containerClass\" (wheel)=\"zoom ? zoomHandler($event) : true\"\n\t(mouseup)=\"pan && panning ? panEndHandler() : true\">\n\t<div class=\"orgchart\" [ngClass]=\"chartClass\" [ngStyle]=\"{'transform': transformVal, 'cursor': cursorVal}\"\n\t\t(mousedown)=\"pan ? panStartHandler($event) : true\" (mousemove)=\"pan && panning ? panHandler($event) : true\"\n\t\t(click)=\"onClickChart($event)\">\n\t\t<orgchart-node [datasource]=\"datasource\" [nodeHeading]=\"nodeHeading\" [nodeContent]=\"nodeContent\"\n\t\t\t[nodeTemplate]=\"nodeTemplate\" [groupScale]=\"groupScale\" [select]=\"select\" (nodeClick)=\"onNodeClick($event)\"></orgchart-node>\n\t</div>\n</div>",
                styles: [".orgchart-container{box-sizing:border-box;position:relative;margin:10px;height:700px;border:2px dashed #aaa;border-radius:5px;overflow:auto;text-align:center}.orgchart{box-sizing:border-box;display:inline-block;background-image:linear-gradient(90deg,rgba(200,0,0,.15) 10%,rgba(0,0,0,0) 10%),linear-gradient(rgba(200,0,0,.15) 10%,rgba(0,0,0,0) 10%);background-size:10px 10px;border:1px dashed transparent;padding:20px}"]
            }] }
];
/** @nocollapse */
ChartContainerComponent.ctorParameters = () => [
    { type: NodeSelectService }
];
ChartContainerComponent.propDecorators = {
    datasource: [{ type: Input }],
    nodeHeading: [{ type: Input }],
    nodeContent: [{ type: Input }],
    nodeTemplate: [{ type: Input }],
    groupScale: [{ type: Input }],
    pan: [{ type: Input }],
    zoom: [{ type: Input }],
    zoomoutLimit: [{ type: Input }],
    zoominLimit: [{ type: Input }],
    containerClass: [{ type: Input }],
    chartClass: [{ type: Input }],
    select: [{ type: Input }],
    nodeClick: [{ type: Output }],
    chartClick: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    ChartContainerComponent.prototype.datasource;
    /** @type {?} */
    ChartContainerComponent.prototype.nodeHeading;
    /** @type {?} */
    ChartContainerComponent.prototype.nodeContent;
    /** @type {?} */
    ChartContainerComponent.prototype.nodeTemplate;
    /** @type {?} */
    ChartContainerComponent.prototype.groupScale;
    /** @type {?} */
    ChartContainerComponent.prototype.pan;
    /** @type {?} */
    ChartContainerComponent.prototype.zoom;
    /** @type {?} */
    ChartContainerComponent.prototype.zoomoutLimit;
    /** @type {?} */
    ChartContainerComponent.prototype.zoominLimit;
    /** @type {?} */
    ChartContainerComponent.prototype.containerClass;
    /** @type {?} */
    ChartContainerComponent.prototype.chartClass;
    /** @type {?} */
    ChartContainerComponent.prototype.select;
    /** @type {?} */
    ChartContainerComponent.prototype.nodeClick;
    /** @type {?} */
    ChartContainerComponent.prototype.chartClick;
    /** @type {?} */
    ChartContainerComponent.prototype.cursorVal;
    /** @type {?} */
    ChartContainerComponent.prototype.panning;
    /** @type {?} */
    ChartContainerComponent.prototype.startX;
    /** @type {?} */
    ChartContainerComponent.prototype.startY;
    /** @type {?} */
    ChartContainerComponent.prototype.transformVal;
    /**
     * @type {?}
     * @private
     */
    ChartContainerComponent.prototype.nodeSelectService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Node {
}
if (false) {
    /** @type {?} */
    Node.prototype.id;
    /** @type {?} */
    Node.prototype.name;
    /** @type {?} */
    Node.prototype.title;
    /** @type {?} */
    Node.prototype.children;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ChartNodeComponent {
    /**
     * @param {?} nodeSelectService
     */
    constructor(nodeSelectService) {
        this.nodeSelectService = nodeSelectService;
        this.nodeClick = new EventEmitter();
        this.Arr = Array; // Array type captured in a variable
        // Array type captured in a variable
        this.isCollapsed = false;
        // subscribe to node selection status
        this.subscription = this.nodeSelectService.getSelect().subscribe((/**
         * @param {?} selection
         * @return {?}
         */
        selection => {
            if (selection && selection.id) {
                this.isSelected = this.datasource.id === selection.id;
            }
            else { // clear selection when empty selection received
                this.isSelected = false;
            }
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    toggleChildren() {
        this.isCollapsed = !this.isCollapsed;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    toggleAnimStart(event) {
        if (this.isCollapsed) {
            // ???????????????????????????????????????????????????????????????????????????????????????
            if (event.element.parentElement &&
                event.element.parentElement.parentElement &&
                event.element.parentElement.parentElement.classList.contains('orgchart')) {
                event.element.previousElementSibling.classList.add('oc-is-collapsed');
            }
        }
        else { // ????????????????????????????????????????????????????????????????????????????????????????????????
            this.ecStyles = {
                display: 'flex'
            };
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    toggleAnimEnd(event) {
        if (this.isCollapsed) { // ????????????????????????????????????????????????????????????????????????????????????????????????
            this.ecStyles = {
                display: 'none'
            };
        }
        else {
            // ???????????????????????????????????????????????????????????????????????????????????????
            if (event.element.parentElement &&
                event.element.parentElement.parentElement &&
                event.element.parentElement.parentElement.classList.contains('orgchart')) {
                event.element.previousElementSibling.classList.remove('oc-is-collapsed');
            }
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onClickNode(e) {
        this.nodeClick.emit(this.datasource);
        if (this.select === 'single') {
            this.nodeSelectService.sendSelect(this.datasource.id);
        }
        else if (this.select === 'multiple') {
            this.isSelected = !this.isSelected;
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onNodeClick(e) {
        this.nodeClick.emit(e);
    }
}
ChartNodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'orgchart-node',
                template: "<div class=\"oc-node\" [id]=\"'oc-' + datasource.id\" [class.oc-is-selected]=\"isSelected\" (click)=\"onClickNode($event)\">\n\t<ng-container\n\t\t*ngTemplateOutlet=\"nodeTemplate ? nodeTemplate : defaultNodeTemplate; context:{ datasource:datasource,nodeHeading: nodeHeading, nodeContent: nodeContent }\">\n\t</ng-container>\n\t<i *ngIf=\"datasource.children\" [ngClass]=\"{'oc-icon-plus': isCollapsed, 'oc-icon-minus': !isCollapsed}\" (click)=\"toggleChildren()\" class=\"oc-toggle-btn oc-icon\"></i>\n</div>\n<div *ngIf=\"datasource.children\" [@expandCollapse]=\"isCollapsed ? 'collapsed' : 'expanded'\"\n\t(@expandCollapse.start)=\"toggleAnimStart($event)\" (@expandCollapse.done)=\"toggleAnimEnd($event)\"\n\t[ngStyle]=\"ecStyles\" class=\"oc-groups\">\n\t<ng-container *ngFor=\"let node of datasource.children;let i=index\">\n\t\t<div *ngIf=\"i % groupScale === 0\" class=\"oc-group\">\n\t\t\t<ng-container *ngFor=\"let temp of Arr(groupScale);let j=index;\">\n\t\t\t\t<orgchart-node *ngIf=\"i + j < datasource.children.length\" [datasource]=\"datasource.children[i + j]\"\n\t\t\t\t\t[nodeHeading]=\"nodeHeading\" [nodeContent]=\"nodeContent\" [nodeTemplate]=\"nodeTemplate\"\n\t\t\t\t\t[groupScale]=\"groupScale\" [select]=\"select\" (nodeClick)=\"onNodeClick($event)\">\n\t\t\t\t</orgchart-node>\n\t\t\t</ng-container>\n\t\t</div>\n\t</ng-container>\n</div>\n\n<ng-template #defaultNodeTemplate let-nodeData=\"datasource\" let-heading=\"nodeHeading\" let-content=\"nodeContent\">\n\t<div class=\"oc-node-heading\">{{nodeData[heading]}}</div>\n\t<div class=\"oc-node-content\">{{nodeData[content]}}</div>\n</ng-template>",
                animations: [
                    trigger('expandCollapse', [
                        state('expanded', style({
                            transform: 'translateY(0)',
                            opacity: 1
                        })),
                        state('collapsed', style({
                            transform: 'translateY(-50px)',
                            opacity: 0
                        })),
                        transition('expanded => collapsed', [animate('0.2s')]),
                        transition('collapsed => expanded', [animate('0.2s')])
                    ])
                ],
                styles: [".oc-groups{display:flex;flex-direction:row}.orgchart>:host{align-items:center}.orgchart>:host>.oc-node::after{content:\"\";box-sizing:border-box;bottom:-10px;left:50%;height:10px;width:2px;position:absolute;background-color:rgba(217,83,79,.8)}.orgchart>:host>.oc-node.oc-is-collapsed::after{display:none}.orgchart>:host>.oc-groups>.oc-group>:host::before{height:35px;top:-10px}.oc-node{width:140px;font-family:Arial;box-sizing:border-box;position:relative;padding:3px;margin:0;border:2px solid transparent;text-align:center}.oc-node.oc-is-selected,.oc-node:hover{background-color:rgba(238,217,54,.5)}.oc-node .oc-node-heading{box-sizing:border-box;padding:2px;margin:0;width:130px;height:20px;text-align:center;font-size:.75rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background-color:rgba(217,83,79,.8);color:#fff;border-radius:4px 4px 0 0}.oc-node .oc-node-content{box-sizing:border-box;padding:2px;width:130px;height:20px;font-size:.625rem;border:1px solid rgba(217,83,79,.8);border-radius:0 0 4px 4px;text-align:center;background-color:#fff;color:#333;text-overflow:ellipsis;white-space:nowrap}.oc-node .oc-toggle-btn{color:#fff;background-color:rgba(68,157,68,.6);position:absolute;left:5px;bottom:5px}.oc-group{display:flex;flex-direction:column;padding-left:20px;position:relative;padding-top:20px}.orgchart>:host>.oc-groups>.oc-group:first-child{padding-left:10px}.oc-group:not(:last-child)::before{content:\"\";box-sizing:border-box;top:10px;left:12px;width:calc(100% - 2px);position:absolute;border-color:rgba(217,83,79,.8);border-style:solid;border-width:0 0 2px}.orgchart>:host>.oc-groups>.oc-group:first-child::before{width:calc(100% + 8px);left:2px}:host{position:relative;display:flex;flex-direction:column}:host:not(:last-child){padding-bottom:10px}.oc-group>:host::before{content:\"\";box-sizing:border-box;height:35px;width:10px;position:absolute;left:-10px;top:-10px;border-color:rgba(217,83,79,.8);border-style:solid;border-width:0 0 2px 2px}.oc-group:first-child>:host:first-child::before{height:45px;top:-20px}:host:not(:last-child)::after{content:\"\";box-sizing:border-box;height:calc(100% - 35px);width:10px;position:absolute;left:-10px;top:25px;border-color:rgba(217,83,79,.8);border-style:solid;border-width:0 0 0 2px}.oc-icon{display:inline-block;width:1rem;height:1rem;line-height:1rem;text-align:center}.oc-icon-minus::before{content:\"\\2212\"}.oc-icon-plus::before{content:\"\\002B\"}"]
            }] }
];
/** @nocollapse */
ChartNodeComponent.ctorParameters = () => [
    { type: NodeSelectService }
];
ChartNodeComponent.propDecorators = {
    datasource: [{ type: Input }],
    nodeHeading: [{ type: Input }],
    nodeContent: [{ type: Input }],
    nodeTemplate: [{ type: Input }],
    groupScale: [{ type: Input }],
    select: [{ type: Input }],
    nodeClick: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    ChartNodeComponent.prototype.datasource;
    /** @type {?} */
    ChartNodeComponent.prototype.nodeHeading;
    /** @type {?} */
    ChartNodeComponent.prototype.nodeContent;
    /** @type {?} */
    ChartNodeComponent.prototype.nodeTemplate;
    /** @type {?} */
    ChartNodeComponent.prototype.groupScale;
    /** @type {?} */
    ChartNodeComponent.prototype.select;
    /** @type {?} */
    ChartNodeComponent.prototype.nodeClick;
    /** @type {?} */
    ChartNodeComponent.prototype.Arr;
    /** @type {?} */
    ChartNodeComponent.prototype.isCollapsed;
    /** @type {?} */
    ChartNodeComponent.prototype.ecStyles;
    /** @type {?} */
    ChartNodeComponent.prototype.isSelected;
    /** @type {?} */
    ChartNodeComponent.prototype.subscription;
    /**
     * @type {?}
     * @private
     */
    ChartNodeComponent.prototype.nodeSelectService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OrgchartModule {
}
OrgchartModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ChartContainerComponent, ChartNodeComponent],
                imports: [
                    CommonModule                ],
                exports: [ChartContainerComponent, ChartNodeComponent],
                providers: [NodeSelectService],
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { OrgchartModule, ChartContainerComponent as ??a, NodeSelectService as ??b, ChartNodeComponent as ??c };
//# sourceMappingURL=dabeng-ng-orgchart.js.map
